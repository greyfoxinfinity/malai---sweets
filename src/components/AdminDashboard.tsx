"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Boxes, ClipboardList, Edit3, Plus, ReceiptText, Settings, ShoppingBasket, Trash2, Upload } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { useSettings } from "@/components/SettingsProvider";
import { categories, type Product, type ProductCategory } from "@/data/products";
import type { BusinessSettings } from "@/lib/business";

type Activity = "overview" | "inventory" | "counter" | "ledger" | "settings";
const money = (value: number) => `৳${value.toLocaleString("en-BD")}`;
const emptyProduct = (): Product => ({ id: `product-${Date.now()}`, name: "", category: "Sweets", price: 0, stock: 0, image: "", description: "" });

export default function AdminDashboard() {
  const { products, transactions, saveProduct, removeProduct, recordSale, loading } = useCatalog();
  const settings = useSettings();
  const [active, setActive] = useState<Activity>("overview");
  const [editing, setEditing] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>({
    siteName: "Malai",
    city: "Chattogram, Bangladesh",
    phone: "",
    whatsappNumber: "",
    deliveryNote: "",
    siteUrl: "http://localhost:3000",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        siteName: settings.siteName || "Malai",
        city: settings.city || "Chattogram, Bangladesh",
        phone: settings.phone || "",
        whatsappNumber: settings.whatsappNumber || "",
        deliveryNote: settings.deliveryNote || "",
        siteUrl: settings.siteUrl || "http://localhost:3000",
      });
    }
  }, [settings]);

  const counterTransactions = transactions.filter((t) => t.source === "counter");
  const counterRevenue = counterTransactions.reduce((total, t) => total + t.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0), 0);
  const todayCounterRevenue = counterTransactions.filter((t) => new Date(t.createdAt).toDateString() === new Date().toDateString()).reduce((total, t) => total + t.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0), 0);
  const totalStock = products.reduce((total, p) => total + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const selectedCounterProduct = useMemo(() => products.find((p) => p.stock > 0), [products]);

  function saveMenuProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const fileUrl = String(form.get("imageFileUrl") || "").trim();
    const urlInput = String(form.get("imageUrl") || "").trim();
    const image = fileUrl || urlInput;
    if (!image) { setNotice("Please upload an image or enter an image URL."); return; }
    saveProduct({ ...editing, name, category: String(form.get("category")) as ProductCategory, price: Number(form.get("price")), stock: Number(form.get("stock")), image, description: String(form.get("description")).trim() });
    setEditing(null);
    setNotice(`${name} saved.`);
  }

  async function addCounterSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const productId = String(form.get("productId"));
    const quantity = Number(form.get("quantity"));
    const ok = await recordSale([{ productId, quantity }], "counter");
    if (ok) {
      setNotice("Counter sale added to the register and inventory updated.");
      event.currentTarget.reset();
    } else {
      setNotice("Sale not saved. Check that the quantity is available.");
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        setNotice("Settings saved successfully! Changes apply across the storefront.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setNotice("Failed to save settings. Please try again.");
      }
    } catch {
      setNotice("Failed to save settings.");
    }
    setSavingSettings(false);
  }

  const cards = [
    { id: "inventory" as Activity, title: "Menu & inventory", value: `${totalStock} units`, detail: `${lowStock} low-stock items`, icon: Boxes },
    { id: "counter" as Activity, title: "Counter sales", value: money(todayCounterRevenue), detail: "Today at the counter", icon: ShoppingBasket },
    { id: "ledger" as Activity, title: "Transaction ledger", value: `${transactions.length} entries`, detail: "Online and counter activity", icon: ClipboardList },
    { id: "settings" as Activity, title: "Business settings", value: settings?.whatsappNumber ? "Configured" : "Not set", detail: "WhatsApp, contact info", icon: Settings },
  ];

  if (loading) return <main className="min-h-screen bg-[#f7f5f1] px-6 py-12 md:px-10 md:py-16 lg:px-16"><div className="mx-auto max-w-7xl"><p className="text-black/50">Loading dashboard...</p></div></main>;

  return <main className="min-h-screen bg-[#f7f5f1] px-6 py-12 md:px-10 md:py-16 lg:px-16"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8b5e3c]">Malai Admin</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Operations dashboard.</h1><p className="mt-3 max-w-2xl leading-7 text-black/60">Choose an activity to manage the daily menu, stock, counter sales, and transaction records.</p></div><Link href="/shop" className="w-fit rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium">View storefront</Link></div>
    {notice && <p role="status" className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-950">{notice}</p>}
    <section className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <button key={card.id} type="button" onClick={() => setActive(card.id)} className={`rounded-2xl p-6 text-left transition-all ${active === card.id ? "bg-[#17130f] text-white shadow-lg" : "bg-white hover:-translate-y-1 hover:shadow-md"}`}><Icon size={22} className={active === card.id ? "text-[#d4a373]" : "text-[#8b5e3c]"} /><p className={`mt-7 text-sm ${active === card.id ? "text-white/60" : "text-black/50"}`}>{card.title}</p><p className="mt-1 text-2xl font-semibold">{card.value}</p><p className={`mt-2 text-sm ${active === card.id ? "text-white/55" : "text-black/50"}`}>{card.detail}</p></button>; })}</section>

    {active === "overview" && <section className="mt-8 rounded-2xl bg-white p-7"><ReceiptText size={26} className="text-[#8b5e3c]" /><h2 className="mt-5 text-2xl font-semibold">Today&apos;s workspace</h2><p className="mt-3 max-w-2xl leading-7 text-black/60">Use the cards above to do one task at a time. Start at <strong>Counter sales</strong> to record in-store sales just as you would in a spreadsheet; the dashboard subtracts stock automatically.</p><button type="button" onClick={() => setActive("counter")} className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-medium text-white">Open counter sales</button></section>}

    {active === "counter" && <section className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><aside className="h-fit rounded-2xl bg-[#17130f] p-6 text-white sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#d4a373]">New entry</p><h2 className="mt-3 text-2xl font-semibold">Counter sale</h2><p className="mt-3 text-sm leading-6 text-white/60">Every entry deducts available stock and adds a row to the counter register.</p><form onSubmit={addCounterSale} className="mt-6 space-y-4"><label className="block text-sm">Product<select required name="productId" defaultValue={selectedCounterProduct?.id ?? ""} className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none">{products.filter((p) => p.stock > 0).map((product) => <option key={product.id} value={product.id}>{product.name} — {money(product.price)} ({product.stock} left)</option>)}</select></label><label className="block text-sm">Quantity sold<input required name="quantity" type="number" min="1" step="1" defaultValue="1" className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none" /></label><button type="submit" disabled={!products.some((p) => p.stock > 0)} className="w-full rounded-full bg-[#d4a373] px-5 py-3.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">Add to counter register</button></form></aside><CounterRegister transactions={counterTransactions} revenue={counterRevenue} /></section>}

    {active === "inventory" && <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl bg-white p-6 sm:p-7"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Menu & inventory</h2><p className="mt-1 text-sm text-black/55">Update the menu or refresh available quantity.</p></div><button type="button" onClick={() => setEditing(emptyProduct())} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white"><Plus size={16} /> Add product</button></div><div className="mt-6 divide-y divide-black/10">{products.map((product) => <article key={product.id} className="flex gap-4 py-4 first:pt-0"><img src={product.image} alt="" className="h-16 w-16 rounded-xl bg-[#f3f0eb] object-cover" /><div className="min-w-0 flex-1"><p className="text-xs font-medium uppercase tracking-[.15em] text-black/45">{product.category}</p><h3 className="mt-1 font-medium">{product.name}</h3><p className="mt-1 text-sm">{money(product.price)} · <span className={product.stock ? "text-green-700" : "font-medium text-red-700"}>{product.stock ? `${product.stock} available` : "Sold out"}</span></p></div><div className="flex gap-1"><button type="button" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`} className="h-11 w-11 rounded-full hover:bg-black/5"><Edit3 size={16} className="mx-auto" /></button><button type="button" onClick={() => { if (window.confirm(`Remove ${product.name}?`)) removeProduct(product.id); }} aria-label={`Remove ${product.name}`} className="h-11 w-11 rounded-full text-red-700 hover:bg-red-50"><Trash2 size={16} className="mx-auto" /></button></div></article>)}</div></div>{editing && <ProductEditor product={editing} onSave={saveMenuProduct} onCancel={() => setEditing(null)} onNotice={setNotice} />}</section>}

    {active === "ledger" && <section className="mt-8 rounded-2xl bg-white p-6 sm:p-7"><h2 className="text-xl font-semibold">Transaction ledger</h2><p className="mt-1 text-sm text-black/55">All online and counter stock deductions in one activity log.</p><Ledger transactions={transactions} /></section>}

    {active === "settings" && <section className="mt-8 rounded-2xl bg-white p-6 sm:p-7"><h2 className="text-xl font-semibold">Business settings</h2><p className="mt-1 text-sm text-black/55">Update your WhatsApp number, phone, delivery note, and other business info. These changes apply across the storefront, cart, and footer.</p><form onSubmit={saveSettings} className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-sm">Business name<input required name="siteName" value={settingsForm.siteName} onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label><label className="block text-sm">City / Location<input required name="city" value={settingsForm.city} onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label><label className="block text-sm">WhatsApp number (with country code)<input required name="whatsappNumber" value={settingsForm.whatsappNumber} onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} placeholder="8801712345678" className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /><p className="mt-1 text-xs text-black/40">Used for order submissions in Cart and WhatsApp link in Footer.</p></label><label className="block text-sm">Phone number<input name="phone" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} placeholder="01712345678" className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /><p className="mt-1 text-xs text-black/40">Displayed in the footer contact section.</p></label><label className="block text-sm sm:col-span-2">Delivery note<textarea name="deliveryNote" rows={2} value={settingsForm.deliveryNote} onChange={(e) => setSettingsForm({ ...settingsForm, deliveryNote: e.target.value })} className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /><p className="mt-1 text-xs text-black/40">Shown in the cart checkout area before the order form.</p></label><label className="block text-sm sm:col-span-2">Site URL<input name="siteUrl" value={settingsForm.siteUrl} onChange={(e) => setSettingsForm({ ...settingsForm, siteUrl: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f5f1] px-4 py-3 text-sm outline-none focus:border-[#8b5e3c]" /></label><div className="sm:col-span-2"><button type="submit" disabled={savingSettings} className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50">{savingSettings ? "Saving..." : "Save settings"}</button></div></form></section>}
  </div></main>;
}

function CounterRegister({ transactions, revenue }: { transactions: { id: string; createdAt: string; items: { productId: string; name: string; quantity: number; unitPrice: number }[] }[]; revenue: number }) {
  return <div className="rounded-2xl bg-white p-6 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8b5e3c]">Counter register</p><h2 className="mt-2 text-2xl font-semibold">Sales log</h2></div><div className="text-right"><p className="text-sm text-black/50">All counter sales</p><p className="text-2xl font-semibold">{money(revenue)}</p></div></div>{transactions.length ? <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-y border-black/10 text-xs uppercase tracking-[.12em] text-black/45"><tr><th className="py-3 pr-4 font-medium">Time</th><th className="py-3 pr-4 font-medium">Product</th><th className="py-3 pr-4 font-medium">Qty</th><th className="py-3 pr-4 font-medium">Unit price</th><th className="py-3 text-right font-medium">Total</th></tr></thead><tbody>{transactions.flatMap((transaction) => transaction.items.map((item) => <tr key={`${transaction.id}-${item.productId}`} className="border-b border-black/7"><td className="py-4 pr-4 text-black/55">{new Date(transaction.createdAt).toLocaleString()}</td><td className="py-4 pr-4 font-medium">{item.name}</td><td className="py-4 pr-4">{item.quantity}</td><td className="py-4 pr-4">{money(item.unitPrice)}</td><td className="py-4 text-right font-semibold">{money(item.quantity * item.unitPrice)}</td></tr>))}</tbody></table></div> : <p className="mt-6 rounded-xl bg-[#f7f5f1] p-5 text-sm text-black/60">No counter sales recorded yet. Add the first sale from the card on the left.</p>}</div>;
}

function Ledger({ transactions }: { transactions: { id: string; source: string; items: { name: string; quantity: number }[]; createdAt: string }[] }) {
  return transactions.length ? <div className="mt-6 divide-y divide-black/10">{transactions.map((transaction) => <div key={transaction.id} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">{transaction.source === "online" ? "Online / WhatsApp order" : "Counter sale"}</p><p className="mt-1 text-sm text-black/55">{transaction.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</p></div><time className="text-xs text-black/45">{new Date(transaction.createdAt).toLocaleString()}</time></div>)}</div> : <p className="mt-6 rounded-xl bg-[#f7f5f1] p-5 text-sm text-black/60">No transactions yet.</p>;
}

function ProductEditor({ product, onSave, onCancel, onNotice }: { product: Product | null; onSave: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; onNotice: (msg: string) => void }) {
  const [preview, setPreview] = useState(product?.image || "");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setUploadedUrl(data.url);
        setPreview(data.url);
      }
    } catch {
      onNotice("Image upload failed. Try again or use a URL instead.");
    }
    setUploading(false);
  }

  function handleRemoveFile() {
    setUploadedUrl("");
    setPreview(product?.image || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <aside className="h-fit rounded-2xl bg-[#17130f] p-6 text-white sm:p-7">
      <h2 className="text-xl font-semibold">{product?.id.startsWith("product-") && product.name === "" ? "Add new product" : "Edit product"}</h2>
      {product ? (
        <form onSubmit={onSave} className="mt-6 space-y-4">
          <label className="block text-sm">Product name
            <input required name="name" defaultValue={product.name} className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none" />
          </label>
          <label className="block text-sm">Category
            <select name="category" defaultValue={product.category} className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none">{categories.map((category) => <option key={category}>{category}</option>)}</select>
          </label>
          <label className="block text-sm">Price (৳)
            <input required min="0" name="price" type="number" defaultValue={product.price} className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none" />
          </label>
          <label className="block text-sm">Available quantity
            <input required min="0" name="stock" type="number" defaultValue={product.stock} className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none" />
          </label>

          {/* Image section */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Product image</p>
            {preview && (
              <div className="relative">
                <img src={preview} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
                {uploadedUrl && (
                  <button type="button" onClick={handleRemoveFile} className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80">Remove upload</button>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/20">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload from device"}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="h-px flex-1 bg-white/10" />
              <span>or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <label className="block text-sm">Image URL
              <input name="imageUrl" type="url" defaultValue={product.image} placeholder="https://example.com/image.jpg" className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-black outline-none" />
              <p className="mt-1 text-xs text-white/40">Paste a link if you don&apos;t have a file. Upload takes priority if both are provided.</p>
            </label>
            <input type="hidden" name="imageFileUrl" value={uploadedUrl} />
          </div>

          <label className="block text-sm">Description
            <textarea required name="description" rows={4} defaultValue={product.description} className="mt-2 w-full resize-y rounded-xl bg-white px-3 py-3 text-black outline-none" />
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{uploading ? "Uploading..." : "Save product"}</button>
            <button type="button" onClick={onCancel} className="rounded-full px-5 py-3 text-sm text-white/70">Cancel</button>
          </div>
        </form>
      ) : (
        <p className="mt-3 text-sm leading-6 text-white/60">Open Menu & inventory to add a new product or edit a current item.</p>
      )}
    </aside>
  );
}
