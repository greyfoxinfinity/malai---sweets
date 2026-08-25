import { NextResponse } from "next/server";
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
  try {
    const data = await req.json();
    const product = await db.product.upsert({
      where: { id: data.id || "" },
      update: {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        image: data.image || "",
        description: data.description || "",
      },
      create: {
        id: data.id || undefined,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
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
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
