// seeders/customerSeeder.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.customer.createMany({
    data: [
      {
        name: "Customer 1",
        email: "customer11@example.com",
        address: "Address 1",
        no_wa: "123456789",
        city: "City 1",
        province: "Province 1",
        postal_code: "12345",
        username: "customer1",
        password: "password1",
      },
      {
        name: "Customer 2",
        email: "customer21@example.com",
        address: "Address 2",
        no_wa: "987654321",
        city: "City 2",
        province: "Province 2",
        postal_code: "54321",
        username: "customer2",
        password: "password2",
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
