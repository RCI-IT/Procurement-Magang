/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `detailpurchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `detailpurchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `purchaseId` on the `detailpurchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `materialId` on the `detailpurchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `orderId` on the `detailpurchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `price` on the `detailpurchases` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `totalPrice` on the `detailpurchases` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - The primary key for the `materials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `materials` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `price` on the `materials` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `categoryId` on the `materials` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `vendorId` on the `materials` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `orderdetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `orderdetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `orderId` on the `orderdetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `materialId` on the `orderdetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `purchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `purchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `vendors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vendors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `detailpurchases` DROP FOREIGN KEY `DetailPurchases_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `detailpurchases` DROP FOREIGN KEY `DetailPurchases_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `detailpurchases` DROP FOREIGN KEY `DetailPurchases_purchaseId_fkey`;

-- DropForeignKey
ALTER TABLE `materials` DROP FOREIGN KEY `Materials_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `materials` DROP FOREIGN KEY `Materials_vendorId_fkey`;

-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_orderId_fkey`;

-- DropIndex
DROP INDEX `DetailPurchases_materialId_fkey` ON `detailpurchases`;

-- DropIndex
DROP INDEX `DetailPurchases_orderId_fkey` ON `detailpurchases`;

-- DropIndex
DROP INDEX `DetailPurchases_purchaseId_fkey` ON `detailpurchases`;

-- DropIndex
DROP INDEX `Materials_categoryId_fkey` ON `materials`;

-- DropIndex
DROP INDEX `Materials_vendorId_fkey` ON `materials`;

-- DropIndex
DROP INDEX `OrderDetails_materialId_fkey` ON `orderdetails`;

-- DropIndex
DROP INDEX `OrderDetails_orderId_fkey` ON `orderdetails`;

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `detailpurchases` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `purchaseId` INTEGER NOT NULL,
    MODIFY `materialId` INTEGER NOT NULL,
    MODIFY `orderId` INTEGER NOT NULL,
    MODIFY `price` DOUBLE NOT NULL,
    MODIFY `totalPrice` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `materials` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `price` DOUBLE NOT NULL,
    MODIFY `categoryId` INTEGER NOT NULL,
    MODIFY `vendorId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `orderdetails` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `orderId` INTEGER NOT NULL,
    MODIFY `materialId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `purchases` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vendors` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materials` ADD CONSTRAINT `Materials_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materials` ADD CONSTRAINT `Materials_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPurchases` ADD CONSTRAINT `DetailPurchases_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPurchases` ADD CONSTRAINT `DetailPurchases_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPurchases` ADD CONSTRAINT `DetailPurchases_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
