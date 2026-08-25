import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let settings = await db.settings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await db.settings.create({ data: {} });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const settings = await db.settings.upsert({
      where: { id: "singleton" },
      update: {
        siteName: data.siteName,
        city: data.city,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        deliveryNote: data.deliveryNote,
        siteUrl: data.siteUrl,
      },
      create: {
        id: "singleton",
        siteName: data.siteName || "Malai",
        city: data.city || "Chattogram, Bangladesh",
        phone: data.phone || "",
        whatsappNumber: data.whatsappNumber || "",
        deliveryNote: data.deliveryNote || "",
        siteUrl: data.siteUrl || "http://localhost:3000",
      },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
