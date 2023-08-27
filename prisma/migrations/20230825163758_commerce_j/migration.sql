/*
  Warnings:

  - You are about to drop the column `id_sales_item` on the `sales` table. All the data in the column will be lost.
  - Added the required column `id_sales` to the `Sales_Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `Sales_id_sales_item_fkey`;

-- AlterTable
ALTER TABLE `sales` DROP COLUMN `id_sales_item`;

-- AlterTable
ALTER TABLE `sales_item` ADD COLUMN `id_sales` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sales_Item` ADD CONSTRAINT `Sales_Item_id_sales_fkey` FOREIGN KEY (`id_sales`) REFERENCES `Sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
