/*
  Warnings:

  - You are about to drop the `DetailPurchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `picLapangan` to the `PermintaanLapangan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermintaanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "DetailPurchases" DROP CONSTRAINT "DetailPurchases_materialId_fkey";

-- DropForeignKey
ALTER TABLE "DetailPurchases" DROP CONSTRAINT "DetailPurchases_orderId_fkey";

-- DropForeignKey
ALTER TABLE "DetailPurchases" DROP CONSTRAINT "DetailPurchases_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_materialId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_orderId_fkey";

-- AlterTable
ALTER TABLE "PermintaanLapangan" ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReceived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keterangan" TEXT,
ADD COLUMN     "picLapangan" TEXT NOT NULL,
ADD COLUMN     "status" "PermintaanStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "DetailPurchases";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderDetails";

-- DropTable
DROP TABLE "Purchases";

-- CreateTable
CREATE TABLE "PermintaanDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "permintaanId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "mention" TEXT,
    "code" TEXT NOT NULL,

    CONSTRAINT "PermintaanDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
