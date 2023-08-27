// seeders/adminSeeder.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.createMany({
    data: [
      { name: "Admin 1", username: "admin1", password: "password1" },
      { name: "Admin 2", username: "admin2", password: "password2" },
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
