"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useCatalog } from "@/components/CatalogProvider";

export default function FeaturedProducts() {
  const { products } = useCatalog();
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

        {/* Products */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
