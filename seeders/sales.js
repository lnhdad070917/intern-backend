// seeders/salesSeeder.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.sales.createMany({
    data: [
      {
        no_invoice: "Inv1",
        code_status: 1,
        price: 200.0,
        total_pay: 220.0,
        id_customer: 2,
        delivery_name: "Delivery 1",
        delivery_cost: 20.0,
      },
      {
        no_invoice: "Inv2",
        code_status: 2,
        price: 150.0,
        total_pay: 160.0,
        id_customer: 1,
        delivery_name: "Delivery 2",
        delivery_cost: 10.0,
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
