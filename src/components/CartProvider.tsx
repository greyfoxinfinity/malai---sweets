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

export type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "malai-cart";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);
      if (savedCart) setItems(JSON.parse(savedCart) as CartItem[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        const maxQty = Math.min(existing.quantity + 1, product.stock);
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: maxQty } : item,
        );
      }
      if (product.stock <= 0) return current;
      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item,
      ),
    );
  }, []);

  const removeItem = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
