const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const defaultProducts = [
  {
    name: "Classic Rasmalai",
    category: "Sweets",
    price: 280,
    stock: 12,
    image: "https://i0.wp.com/blendofspicesbysara.com/wp-content/uploads/2021/03/00000IMG_00000_BURST20200217124607796_COVER-01.jpeg?ssl=1&w=800",
    description: "Soft, creamy rasmalai soaked in fragrant milk and finished with delicate nuts.",
  },
  {
    name: "Gulab Jamun",
    category: "Sweets",
    price: 220,
    stock: 16,
    image: "https://images.unsplash.com/photo-1666190094762-8e8b4f0f5e3e?auto=format&fit=crop&w=1000&q=85",
    description: "Warm, soft milk-solid dumplings soaked in aromatic sugar syrup.",
  },
  {
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 220,
    stock: 10,
    image: "https://debrownieexpress.nl/cdn/shop/files/originalbrownie.jpg?v=1731357158&width=1445",
    description: "Rich, fudgy chocolate brownie with an indulgent chocolate finish.",
  },
  {
    name: "Mango Delight",
    category: "Desserts",
    price: 250,
    stock: 8,
    image: "https://aromaticessence.co/wp-content/uploads/2015/06/6CEC102A-4517-4966-9F77-ED418E94B4A5-500x500.jpeg",
    description: "A creamy mango dessert made for lovers of bright tropical flavors.",
  },
  {
    name: "Classic Samosa",
    category: "Snacks",
    price: 40,
    stock: 30,
    image: "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/06/GettyImages-1156059928-1-scaled.jpg?size=%2A%3A900",
    description: "Crispy golden pastry filled with a flavorful spiced potato mixture.",
  },
  {
    name: "Malai Ice Cream",
    category: "Ice Cream",
    price: 180,
    stock: 6,
    image: "https://images.unsplash.com/photo-1529739121416-921f4dae728e?auto=format&fit=crop&w=1200&q=85",
    description: "Smooth, creamy ice cream made for the perfect cold treat.",
  },
];

async function main() {
  // Seed settings
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Malai",
      city: "Chattogram, Bangladesh",
      phone: "",
      whatsappNumber: "",
      deliveryNote: "Delivery availability and charges are confirmed on WhatsApp before your order is accepted.",
      siteUrl: "http://localhost:3000",
    },
  });

  // Seed products
  for (const product of defaultProducts) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  // Seed admin user
  const adminEmail = "admin@malai.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });
    console.log("Admin user created: admin@malai.com / admin123");
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
