// seeders/salesItemSeeder.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.sales_Item.createMany({
    data: [
      {
        id_product: 1,
        id_sales: 1,
        price: 100.0,
        qty: 2,
        id_customer: 1,
        ket: "Item 1",
      },
      {
        id_product: 2,
        id_sales: 2,
        price: 75.0,
        qty: 3,
        id_customer: 2,
        ket: "Item 2",
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
