-- DropForeignKey
ALTER TABLE `sales_item` DROP FOREIGN KEY `Sales_Item_id_customer_fkey`;

-- DropForeignKey
ALTER TABLE `sales_item` DROP FOREIGN KEY `Sales_Item_id_product_fkey`;

-- AddForeignKey
ALTER TABLE `sales_item` ADD CONSTRAINT `sales_item_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales_item` ADD CONSTRAINT `sales_item_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
