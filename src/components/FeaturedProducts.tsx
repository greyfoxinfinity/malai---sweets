"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useCatalog } from "@/components/CatalogProvider";

export default function FeaturedProducts() {
  const { products, loading, error } = useCatalog();

  return (
    <section
      id="shop"
      className="bg-white px-6 py-16 md:px-10 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
              From Malai
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl">
              Made to make you smile.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group w-fit inline-flex items-center gap-2 rounded-full border border-black/15 bg-[#f7f5f1] px-6 py-3 text-sm font-medium text-black transition-all hover:bg-black hover:text-white"
          >
            View all products
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
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
        ) : error ? (
          <div className="rounded-2xl bg-[#f7f5f1] p-10 text-center">
            <p className="text-lg font-medium">Unable to load products</p>
            <p className="mt-2 text-sm text-black/50">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
