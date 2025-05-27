/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ConfirmationDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ConfirmationOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Materials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PermintaanDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PermintaanLapangan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PurchaseDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PurchaseOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vendors` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Categories_id_seq";

-- AlterTable
ALTER TABLE "ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "confirmationOrderId" SET DATA TYPE TEXT,
ALTER COLUMN "materialId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ConfirmationDetails_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ConfirmationDetails_id_seq";

-- AlterTable
ALTER TABLE "ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "permintaanId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ConfirmationOrder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ConfirmationOrder_id_seq";

-- AlterTable
ALTER TABLE "Materials" DROP CONSTRAINT "Materials_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ALTER COLUMN "vendorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Materials_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Materials_id_seq";

-- AlterTable
ALTER TABLE "PermintaanDetails" DROP CONSTRAINT "PermintaanDetails_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "permintaanId" SET DATA TYPE TEXT,
ALTER COLUMN "materialId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PermintaanDetails_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PermintaanDetails_id_seq";

-- AlterTable
ALTER TABLE "PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PermintaanLapangan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PermintaanLapangan_id_seq";

-- AlterTable
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "purchaseOrderId" SET DATA TYPE TEXT,
ALTER COLUMN "materialId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PurchaseDetails_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PurchaseDetails_id_seq";

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "confirmationOrderId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PurchaseOrder_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "Vendors" DROP CONSTRAINT "Vendors_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Vendors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Vendors_id_seq";

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
