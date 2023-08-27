// seeders/statusSeeder.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.status.createMany({
    data: [
      { code: "S1", label: "Status 1" },
      { code: "S2", label: "Status 2" },
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
