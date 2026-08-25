"use client";

import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/components/SettingsProvider";

export default function Footer() {
  const settings = useSettings();
  const whatsappNumber = (settings?.whatsappNumber || "").replace(/\D/g, "");

  return (
    <footer className="bg-[#17130f] px-6 pb-8 pt-20 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-semibold tracking-tight">
              {settings?.siteName || "Malai"}
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
              Sweet moments, made better. Discover our collection of
              handcrafted sweets, desserts, snacks, and more.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex gap-3">
              <a
                href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#"}
                aria-label="Order on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-xs font-semibold transition-colors hover:bg-white hover:text-black"
              >
                WA
              </a>

              <Link
                href="/shop"
                aria-label="Browse the menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-sm font-semibold transition-colors hover:bg-white hover:text-black"
              >
                →
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold">
              Explore
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/50">
              <li>
                <Link href="/shop" className="transition-colors hover:text-white">
                  Shop
                </Link>
              </li>

              <li>
                <Link href="/shop?category=Sweets" className="transition-colors hover:text-white">
                  Sweets
                </Link>
              </li>

              <li>
                <Link href="/shop?category=Snacks" className="transition-colors hover:text-white">
                  Snacks
                </Link>
              </li>

              <li>
                <Link href="/shop?category=Desserts" className="transition-colors hover:text-white">
                  Desserts
                </Link>
              </li>

              <li>
                <Link href="/#about" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">
              Get in touch
            </h3>

            <div className="mt-5 space-y-4 text-sm text-white/50">

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {settings?.city || "Chattogram, Bangladesh"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="shrink-0"
                />

                <span>
                  {settings?.phone || "Contact us on WhatsApp"}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {settings?.siteName || "Malai"}. All rights reserved.
          </p>

          <p>
            Made with care in Bangladesh.
          </p>
        </div>

      </div>
    </footer>
  );
}
