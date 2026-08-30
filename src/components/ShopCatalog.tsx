"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, type ProductCategory } from "@/data/products";
import { useCatalog } from "@/components/CatalogProvider";

type ShopCatalogProps = { initialCategory?: string };

export default function ShopCatalog({ initialCategory }: ShopCatalogProps) {
  const { products, loading, error } = useCatalog();
  const validCategory = categories.includes(initialCategory as ProductCategory)
    ? (initialCategory as ProductCategory)
    : "All";
  const [category, setCategory] = useState<ProductCategory | "All">(validCategory);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      (!normalizedQuery ||
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(normalizedQuery)),
  );

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 pb-12 pt-16 md:px-10 md:pt-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
            The Malai Shop
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl md:text-7xl">
            Something delicious
            <br className="hidden sm:block" />
            for everyone.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-black/60 md:text-lg">
            Choose your favourites, add them to your order, then send the details to us on WhatsApp.
          </p>
        </div>
      </section>

      <section className="border-y border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-10 lg:px-16">
          <div className="flex gap-3 overflow-x-auto pb-2" aria-label="Product categories">
            {(["All", ...categories] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                  category === item
                    ? "bg-black text-white"
                    : "border border-black/10 hover:bg-black hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label
            className="mt-4 flex max-w-md items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#8b5e3c]"
            htmlFor="product-search"
          >
            <Search size={18} aria-hidden="true" className="text-black/45" />
            <input
              id="product-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sweets, snacks, desserts…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
            />
          </label>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <>
              <div className="mb-10 h-4 w-24 animate-pulse rounded bg-gray-100" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square rounded-2xl bg-gray-100" />
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-16 rounded bg-gray-100" />
                      <div className="h-5 w-3/4 rounded bg-gray-100" />
                      <div className="h-4 w-1/3 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <div className="rounded-2xl bg-[#f7f5f1] p-10 text-center">
              <p className="text-lg font-medium">Unable to load products</p>
              <p className="mt-2 text-sm text-black/50">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 border-b border-black text-sm"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <p className="mb-10 text-sm text-black/50">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "product" : "products"}
              </p>
              {visibleProducts.length ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#f7f5f1] p-10 text-center">
                  <p className="text-lg font-medium">No treats found.</p>
                  <button
                    type="button"
                    className="mt-3 border-b border-black text-sm"
                    onClick={() => {
                      setQuery("");
                      setCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
