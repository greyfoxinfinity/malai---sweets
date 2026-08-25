"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { BusinessSettings } from "@/lib/business";

const SettingsContext = createContext<BusinessSettings | null>(null);

const defaults: BusinessSettings = {
  siteName: "Malai",
  city: "Chattogram, Bangladesh",
  phone: "",
  whatsappNumber: "",
  deliveryNote: "Delivery availability and charges are confirmed on WhatsApp before your order is accepted.",
  siteUrl: "http://localhost:3000",
};

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(defaults);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings({
            siteName: data.siteName || defaults.siteName,
            city: data.city || defaults.city,
            phone: data.phone || defaults.phone,
            whatsappNumber: data.whatsappNumber || defaults.whatsappNumber,
            deliveryNote: data.deliveryNote || defaults.deliveryNote,
            siteUrl: data.siteUrl || defaults.siteUrl,
          });
        }
      })
      .catch(() => {});
  }, []);

  const value = useMemo(() => settings, [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
