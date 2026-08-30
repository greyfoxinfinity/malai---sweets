import type { Metadata } from "next";
import ShopCatalog from "@/components/ShopCatalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of handcrafted sweets, snacks, desserts, and ice cream.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <ShopCatalog initialCategory={category} />;
}
