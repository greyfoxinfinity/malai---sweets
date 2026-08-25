"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useCatalog } from "@/components/CatalogProvider";
import { useSettings } from "@/components/SettingsProvider";

const formatMoney = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

export default function CartPage() {
  const { data: session } = useSession();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { recordSale } = useCatalog();
  const settings = useSettings();
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const whatsappNumber = (settings?.whatsappNumber || "").replace(/\D/g, "");
  const businessName = settings?.siteName || "Malai";
  const whatsappReady = Boolean(whatsappNumber);

  const user = session?.user as { name?: string; phone?: string; address?: string } | undefined;

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!whatsappReady || !items.length) return;
    const fields = new FormData(event.currentTarget);
    recordSale(items.map((item) => ({ productId: item.id, quantity: item.quantity })), "online");
    const customer = String(fields.get("name") || "");
    const phone = String(fields.get("phone") || "");
    const address = String(fields.get("address") || "");
    const note = String(fields.get("note") || "");
    const lines = items.map((item) => `• ${item.name} × ${item.quantity} — ${formatMoney(item.price * item.quantity)}`);
    const orderMessage = [`Hello ${businessName}! I would like to place a cash-on-delivery order.`, "", "ORDER", ...lines, "", `Subtotal: ${formatMoney(subtotal)}`, "Payment: Cash on delivery", "", "CUSTOMER DETAILS", `Name: ${customer}`, `Phone: ${phone}`, `Delivery address: ${address}`, note ? `Note: ${note}` : ""].filter(Boolean).join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer");
    clearCart();
    setSent(true);
    setMessage("Your order summary is open in WhatsApp. Send the message there to complete your order.");
  }

  if (!items.length) return <main className="mx-auto flex min-h-[65vh] max-w-7xl flex-col items-center justify-center px-6 text-center"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">Your order</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your cart is empty.</h1><p className="mt-4 max-w-md text-black/60">Pick something delicious, then we&apos;ll help you send the order details on WhatsApp.</p><Link href="/shop" className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-medium text-white">Browse the menu</Link></main>;

  return <main className="bg-[#f7f5f1] px-6 py-12 md:px-10 md:py-20 lg:px-16"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">Your order</p><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Review and order.</h1>{user && <p className="text-sm text-black/50">Ordering as <span className="font-medium text-black/70">{user.name}</span> · <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="underline underline-offset-2 hover:text-black">logout</button></p>}</div><div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]"><section className="space-y-4">{items.map((item) => <article key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 sm:p-5"><img src={item.image} alt="" className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[.16em] text-black/45">{item.category}</p><h2 className="mt-1 font-medium">{item.name}</h2></div><button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="h-11 w-11 rounded-full text-black/50 hover:bg-black/5"><Trash2 size={17} className="mx-auto" /></button></div><div className="mt-5 flex items-center justify-between"><div className="flex h-11 items-center rounded-full border border-black/10"><button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="flex h-11 w-11 items-center justify-center"><Minus size={15} /></button><span className="w-8 text-center text-sm">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} className="flex h-11 w-11 items-center justify-center"><Plus size={15} /></button></div><p className="font-semibold">{formatMoney(item.price * item.quantity)}</p></div></div></article>)}</section><aside className="h-fit rounded-2xl bg-white p-6 sm:p-8"><h2 className="text-xl font-semibold">Cash on delivery</h2><p className="mt-2 text-sm leading-6 text-black/60">{settings?.deliveryNote || "We will confirm your delivery availability and final total on WhatsApp before preparing your order."}</p><div className="my-6 border-t border-black/10" /><div className="flex items-center justify-between"><p className="text-sm text-black/60">Subtotal</p><p className="font-semibold">{formatMoney(subtotal)}</p></div><p className="mt-3 text-xs text-black/45">Final total and delivery charges confirmed on WhatsApp.</p>{sent ? <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm leading-6 text-green-900"><p className="font-medium">Order sent!</p><p className="mt-1">{message}</p></div> : <form onSubmit={submitOrder} className="mt-6 space-y-4"><label className="block text-sm">Your name<input required name="name" type="text" placeholder="e.g. Rahim" defaultValue={user?.name || ""} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label><label className="block text-sm">Phone number<input required name="phone" type="tel" placeholder="01XXXXXXXXX" defaultValue={user?.phone || ""} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label><label className="block text-sm">Delivery address<textarea required name="address" rows={2} placeholder="House / road / area" defaultValue={user?.address || ""} className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label><label className="block text-sm">Note (optional)<input name="note" type="text" placeholder="Special instructions" className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label>{message && !sent && <p className="text-sm text-red-600">{message}</p>}<button type="submit" disabled={!whatsappReady} className="mt-2 w-full rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{whatsappReady ? "Send order on WhatsApp" : "WhatsApp not configured"}</button></form>}</aside></div></div></main>;
}
