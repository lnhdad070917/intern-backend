/*
  Warnings:

  - You are about to drop the `salesitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `Sales_id_sales_item_fkey`;

-- DropForeignKey
ALTER TABLE `salesitem` DROP FOREIGN KEY `salesItem_id_customer_fkey`;

-- DropForeignKey
ALTER TABLE `salesitem` DROP FOREIGN KEY `salesItem_id_product_fkey`;

-- DropTable
DROP TABLE `salesitem`;

-- CreateTable
CREATE TABLE `Sales_Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_product` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `qty` INTEGER NOT NULL,
    `id_customer` INTEGER NOT NULL,
    `ket` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sales` ADD CONSTRAINT `Sales_id_sales_item_fkey` FOREIGN KEY (`id_sales_item`) REFERENCES `Sales_Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sales_Item` ADD CONSTRAINT `Sales_Item_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sales_Item` ADD CONSTRAINT `Sales_Item_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
