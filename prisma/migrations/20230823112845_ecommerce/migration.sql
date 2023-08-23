/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Status_code_key` ON `Status`(`code`);
