import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.name || !data.category || data.price == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await db.product.upsert({
      where: { id: data.id || "" },
      update: {
        name: data.name,
        category: data.category,
        price: Math.max(0, Math.floor(data.price)),
        stock: Math.max(0, Math.floor(data.stock || 0)),
        image: data.image || "",
        description: data.description || "",
      },
      create: {
        id: data.id || undefined,
        name: data.name,
        category: data.category,
        price: Math.max(0, Math.floor(data.price)),
        stock: Math.max(0, Math.floor(data.stock || 0)),
        image: data.image || "",
        description: data.description || "",
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
