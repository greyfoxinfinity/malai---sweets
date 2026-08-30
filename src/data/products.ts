export const categories = ["Sweets", "Snacks", "Desserts", "Ice Cream"] as const;
export type ProductCategory = (typeof categories)[number];

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image: string;
  description: string;
};
