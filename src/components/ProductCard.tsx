"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (product.stock <= 0) return;
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }
  return (
    <div className="group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f3f0eb]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Add Button */}
        <button
          type="button"
          onClick={addToCart}
          aria-label={`Add ${product.name} to cart`}
          disabled={product.stock <= 0}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-all duration-300 hover:scale-110 hover:bg-[#8b5e3c] disabled:cursor-not-allowed disabled:bg-black/40"
        >
          {added ? <Check size={20} strokeWidth={2} /> : <Plus size={20} strokeWidth={2} />}
        </button>
        {product.stock <= 0 && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black">Sold out</span>}
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
          {product.category}
        </p>

        <div className="mt-1 flex items-center justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-medium text-black">{product.name}</h3>

          <span className="text-base font-semibold text-black">
            ৳{product.price}
          </span>
        </div>
        <p className={`mt-1 text-xs ${product.stock > 0 ? "text-black/45" : "font-medium text-red-700"}`}>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
      </div>
    </div>
  );
}
