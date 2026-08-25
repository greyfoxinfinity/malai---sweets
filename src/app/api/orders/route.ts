import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
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
  try {
    const { customerName, customerPhone, address, note, items, source } = await req.json();

    if (!customerName || !customerPhone || !address || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await db.product.findMany({ where: { id: { in: productIds } } });

    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
    });

    const subtotal = orderItems.reduce((sum: number, i: { unitPrice: number; quantity: number }) => sum + i.unitPrice * i.quantity, 0);

    const order = await db.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        note: note || "",
        subtotal,
        source: source || "online",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    for (const item of orderItems) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
