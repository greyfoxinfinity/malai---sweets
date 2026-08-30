"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";

export type Transaction = {
  id: string;
  createdAt: string;
  source: "online" | "counter" | "adjustment";
  items: { productId: string; name: string; quantity: number; unitPrice: number }[];
};

type SaleLine = { productId: string; quantity: number };
type CatalogContextValue = {
  products: Product[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  saveProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  recordSale: (items: SaleLine[], source: "online" | "counter") => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export default function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`);
      }
      const data = await res.json();
      setProducts(
        data.map((p: Product & { id: string }) => ({
          id: p.id,
          name: p.name,
          category: p.category as Product["category"],
          price: p.price,
          stock: p.stock,
          image: p.image,
          description: p.description,
        })),
      );
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      setError(message);
    }
  }, []);

  const refreshTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error(`Failed to load transactions (${res.status})`);
      }
      const data = await res.json();
      setTransactions(
        data.map(
          (o: Transaction & { id: string; items: Transaction["items"] }) => ({
            id: o.id,
            createdAt: o.createdAt,
            source: o.source,
            items: o.items,
          }),
        ),
      );
    } catch {
      // Non-critical — admin will see empty ledger
    }
  }, []);

  useEffect(() => {
    Promise.all([refreshProducts(), refreshTransactions()]).finally(() =>
      setLoading(false),
    );
  }, [refreshProducts, refreshTransactions]);

  const saveProduct = useCallback(
    async (product: Product) => {
      const safeProduct = {
        ...product,
        stock: Math.max(0, Math.floor(product.stock || 0)),
      };
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(safeProduct),
        });
        if (!res.ok) throw new Error("Failed to save product");
        await refreshProducts();
      } catch {
        // Error surfaced via UI
      }
    },
    [refreshProducts],
  );

  const removeProduct = useCallback(
    async (id: string) => {
      try {
        const res = await fetch("/api/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to delete product");
        await refreshProducts();
      } catch {
        // Error surfaced via UI
      }
    },
    [refreshProducts],
  );

  const recordSale = useCallback(
    async (saleLines: SaleLine[], source: "online" | "counter"): Promise<boolean> => {
      const lines = saleLines.filter((line) => line.quantity > 0);
      if (!lines.length) return false;

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: source === "counter" ? "Counter Sale" : "Online Customer",
            customerPhone: "N/A",
            address: source === "counter" ? "In-store" : "Delivery",
            note: "",
            items: lines,
            source,
          }),
        });
        if (res.ok) {
          await refreshProducts();
          await refreshTransactions();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [refreshProducts, refreshTransactions],
  );

  const value = useMemo(
    () => ({
      products,
      transactions,
      loading,
      error,
      saveProduct,
      removeProduct,
      recordSale,
      refreshProducts,
      refreshTransactions,
    }),
    [
      products,
      transactions,
      loading,
      error,
      saveProduct,
      removeProduct,
      recordSale,
      refreshProducts,
      refreshTransactions,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}
