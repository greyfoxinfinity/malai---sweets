import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { customerName, customerPhone, address, note, items, source } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 });
    }

    const order = await db.$transaction(async (tx) => {
      const productIds = items.map((i: { productId: string }) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });

      const orderItems = items.map((item: { productId: string; quantity: number }) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}: requested ${item.quantity}, available ${product.stock}`);
        }
        return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
      });

      const subtotal = orderItems.reduce(
        (sum: number, i: { unitPrice: number; quantity: number }) => sum + i.unitPrice * i.quantity,
        0,
      );

      const createdOrder = await tx.order.create({
        data: {
          customerName: customerName || "Counter Sale",
          customerPhone: customerPhone || "N/A",
          address: address || "In-store",
          note: note || "",
          subtotal,
          source: source || "online",
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const item of orderItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`Stock changed for product ${item.productId} — order aborted`);
        }
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
