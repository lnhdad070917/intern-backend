// seeders/productSeeder.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        code: "P1",
        id_category: 1,
        name: "Product 1",
        img: "product1.jpg",
        weight: 1000,
        stock: 50,
        price: 100.0,
        price_discount: 90.0,
        description: "Description for Product 1",
        variant: "Variant A",
      },
      {
        code: "P2",
        id_category: 2,
        name: "Product 2",
        img: "product2.jpg",
        weight: 800,
        stock: 30,
        price: 75.0,
        price_discount: 70.0,
        description: "Description for Product 2",
        variant: "Variant B",
      },
      // ... tambahkan data lainnya
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
