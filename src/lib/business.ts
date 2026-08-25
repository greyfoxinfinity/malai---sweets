export type BusinessSettings = {
  siteName: string;
  city: string;
  phone: string;
  whatsappNumber: string;
  deliveryNote: string;
  siteUrl: string;
};

const defaults: BusinessSettings = {
  siteName: "Malai",
  city: "Chattogram, Bangladesh",
  phone: "",
  whatsappNumber: "",
  deliveryNote: "Delivery availability and charges are confirmed on WhatsApp before your order is accepted.",
  siteUrl: "http://localhost:3000",
};

export function getBusiness(settings: BusinessSettings | null) {
  const s = settings || defaults;
  return {
    name: s.siteName,
    city: s.city,
    phone: s.phone || "Contact us on WhatsApp",
    whatsappNumber: s.whatsappNumber.replace(/\D/g, ""),
    deliveryNote: s.deliveryNote,
  };
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
