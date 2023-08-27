/*
  Warnings:

  - You are about to drop the column `id_deliveries` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `id_customer` on the `sales_item` table. All the data in the column will be lost.
  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_customer` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sales_item` DROP FOREIGN KEY `Sales_Item_id_customer_fkey`;

-- AlterTable
ALTER TABLE `sales` DROP COLUMN `id_deliveries`,
    ADD COLUMN `id_customer` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `sales_item` DROP COLUMN `id_customer`;

-- DropTable
DROP TABLE `refreshtoken`;

-- AddForeignKey
ALTER TABLE `Sales` ADD CONSTRAINT `Sales_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
