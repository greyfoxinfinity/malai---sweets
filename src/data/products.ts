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

export const products: Product[] = [
  {
    id: "classic-rasmalai",
    name: "Classic Rasmalai",
    category: "Sweets",
    price: 280,
    stock: 12,
    image:
      "https://i0.wp.com/blendofspicesbysara.com/wp-content/uploads/2021/03/00000IMG_00000_BURST20200217124607796_COVER-01.jpeg?ssl=1&w=800",
    description:
      "Soft, creamy rasmalai soaked in fragrant milk and finished with delicate nuts.",
  },

  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "Sweets",
    price: 220,
    stock: 16,
    image:
      "https://images.unsplash.com/photo-1666190094762-8e8b4f0f5e3e?auto=format&fit=crop&w=1000&q=85",
    description:
      "Warm, soft milk-solid dumplings soaked in aromatic sugar syrup.",
  },

  {
    id: "chocolate-brownie",
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 220,
    stock: 10,
    image:
      "https://debrownieexpress.nl/cdn/shop/files/originalbrownie.jpg?v=1731357158&width=1445",
    description:
      "Rich, fudgy chocolate brownie with an indulgent chocolate finish.",
  },

  {
    id: "mango-delight",
    name: "Mango Delight",
    category: "Desserts",
    price: 250,
    stock: 8,
    image:
      "https://aromaticessence.co/wp-content/uploads/2015/06/6CEC102A-4517-4966-9F77-ED418E94B4A5-500x500.jpeg",
    description:
      "A creamy mango dessert made for lovers of bright tropical flavors.",
  },

  {
    id: "samosa",
    name: "Classic Samosa",
    category: "Snacks",
    price: 40,
    stock: 30,
    image:
      "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/06/GettyImages-1156059928-1-scaled.jpg?size=%2A%3A900",
    description:
      "Crispy golden pastry filled with a flavorful spiced potato mixture.",
  },

  {
    id: "malai-ice-cream",
    name: "Malai Ice Cream",
    category: "Ice Cream",
    price: 180,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1529739121416-921f4dae728e?auto=format&fit=crop&w=1200&q=85",
    description:
      "Smooth, creamy ice cream made for the perfect cold treat.",
  },
];
