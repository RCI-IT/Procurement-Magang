/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ConfirmationDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ConfirmationDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ConfirmationOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ConfirmationOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `ConfirmationOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `permintaanId` column on the `ConfirmationOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Materials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Materials` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PermintaanDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PermintaanDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PermintaanLapangan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PermintaanLapangan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `PermintaanLapangan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PurchaseDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PurchaseOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `PurchaseOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Vendors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Vendors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `confirmationOrderId` on the `ConfirmationDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `materialId` on the `ConfirmationDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `Materials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `Materials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendorId` on the `Materials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `permintaanId` on the `PermintaanDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `materialId` on the `PermintaanDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `purchaseOrderId` on the `PurchaseDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `materialId` on the `PurchaseDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `confirmationOrderId` on the `PurchaseOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_confirmationOrderId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_permintaanId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "Materials" DROP CONSTRAINT "Materials_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Materials" DROP CONSTRAINT "Materials_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "PermintaanDetails" DROP CONSTRAINT "PermintaanDetails_materialId_fkey";

-- DropForeignKey
ALTER TABLE "PermintaanDetails" DROP CONSTRAINT "PermintaanDetails_permintaanId_fkey";

-- DropForeignKey
ALTER TABLE "PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_userId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_materialId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_confirmationOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_userId_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "confirmationOrderId",
ADD COLUMN     "confirmationOrderId" INTEGER NOT NULL,
DROP COLUMN "materialId",
ADD COLUMN     "materialId" INTEGER NOT NULL,
ADD CONSTRAINT "ConfirmationDetails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
DROP COLUMN "permintaanId",
ADD COLUMN     "permintaanId" INTEGER,
ADD CONSTRAINT "ConfirmationOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Materials" DROP CONSTRAINT "Materials_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
DROP COLUMN "vendorId",
ADD COLUMN     "vendorId" INTEGER NOT NULL,
ADD CONSTRAINT "Materials_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PermintaanDetails" DROP CONSTRAINT "PermintaanDetails_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "permintaanId",
ADD COLUMN     "permintaanId" INTEGER NOT NULL,
DROP COLUMN "materialId",
ADD COLUMN     "materialId" INTEGER NOT NULL,
ADD CONSTRAINT "PermintaanDetails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
ADD CONSTRAINT "PermintaanLapangan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "purchaseOrderId",
ADD COLUMN     "purchaseOrderId" INTEGER NOT NULL,
DROP COLUMN "materialId",
ADD COLUMN     "materialId" INTEGER NOT NULL,
ADD CONSTRAINT "PurchaseDetails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "confirmationOrderId",
ADD COLUMN     "confirmationOrderId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vendors" DROP CONSTRAINT "Vendors_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Vendors_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_confirmationOrderId_key" ON "PurchaseOrder"("confirmationOrderId");

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
