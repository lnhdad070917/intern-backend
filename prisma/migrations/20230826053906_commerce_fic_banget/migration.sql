/*
  Warnings:

  - Added the required column `id_customer` to the `Sales_Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sales_item` ADD COLUMN `id_customer` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sales_Item` ADD CONSTRAINT `Sales_Item_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
