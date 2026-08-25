import ShopCatalog from "@/components/ShopCatalog";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <ShopCatalog initialCategory={category} />;
}
