"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Sweets", href: "/shop?category=Sweets" },
  { name: "Snacks", href: "/shop?category=Snacks" },
  { name: "Desserts", href: "/shop?category=Desserts" },
  { name: "About", href: "/#about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as { name?: string; role?: string } | undefined;
  const isCustomer = user && user.role === "customer";

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <nav className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10 md:py-6 lg:px-16">
      <Link href="/" className="text-2xl font-semibold tracking-tight">Malai</Link>
      <div className="hidden items-center gap-7 md:flex">
        {navLinks.map((link) => <Link key={link.name} href={link.href} className="text-sm text-black/70 transition-colors hover:text-black">{link.name}</Link>)}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Link href="/shop" aria-label="Search products" className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-black/5"><Search size={19} /></Link>

        {isCustomer ? (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              className="flex h-11 items-center gap-2 rounded-full px-3 transition-colors hover:bg-black/5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8b5e3c] text-xs font-semibold text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
              <span className="hidden text-sm font-medium md:inline">{user.name}</span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-12 z-30 w-48 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                <p className="px-3 py-2 text-xs text-black/40">Signed in as</p>
                <p className="truncate px-3 py-1 text-sm font-medium">{user.name}</p>
                <div className="my-1 border-t border-black/10" />
                <Link href="/cart" onClick={() => setUserMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-[#f7f5f1]">My cart</Link>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" aria-label="Customer or admin login" className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-black/5"><UserRound size={19} /></Link>
        )}

        <Link href="/cart" aria-label={`Shopping cart with ${itemCount} items`} className="flex h-11 items-center gap-2 rounded-full px-3 transition-colors hover:bg-black/5"><ShoppingBag size={19} /><span className="hidden text-sm md:inline">Cart ({itemCount})</span></Link>
        <button type="button" aria-label="Toggle navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 md:hidden">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {menuOpen && <div ref={menuRef} className="absolute inset-x-6 top-[68px] z-20 rounded-2xl border border-black/10 bg-white p-3 shadow-xl transition-all md:hidden">{navLinks.map((link) => <Link key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm hover:bg-[#f7f5f1]">{link.name}</Link>)}</div>}
    </nav>
  );
}
