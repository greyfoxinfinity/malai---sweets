import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartProvider from "@/components/CartProvider";
import CatalogProvider from "@/components/CatalogProvider";
import SettingsProvider from "@/components/SettingsProvider";
import AuthProvider from "@/components/AuthProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://malai.example.com"),
  title: { default: "Malai — Sweets, Snacks & Desserts", template: "%s | Malai" },
  description:
    "Discover handcrafted sweets, snacks, ice cream, and desserts made for every occasion.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <AuthProvider>
          <SettingsProvider>
            <CatalogProvider>
              <CartProvider>
                <Navbar />
                {children}
              </CartProvider>
            </CatalogProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
