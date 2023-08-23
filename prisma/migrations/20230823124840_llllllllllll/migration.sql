-- DropForeignKey
ALTER TABLE `salesitem` DROP FOREIGN KEY `SalesItem_id_customer_fkey`;

-- DropForeignKey
ALTER TABLE `salesitem` DROP FOREIGN KEY `SalesItem_id_product_fkey`;

-- AddForeignKey
ALTER TABLE `salesItem` ADD CONSTRAINT `salesItem_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesItem` ADD CONSTRAINT `salesItem_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
