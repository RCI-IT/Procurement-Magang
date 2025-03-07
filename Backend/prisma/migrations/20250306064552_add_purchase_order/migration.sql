/*
  Warnings:

  - A unique constraint covering the columns `[purchaseOrderId]` on the table `PermintaanLapangan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PermintaanDetails" ADD COLUMN     "keterangan" TEXT;

-- AlterTable
ALTER TABLE "PermintaanLapangan" ADD COLUMN     "purchaseOrderId" INTEGER;

-- AlterTable
ALTER TABLE "Vendors" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomorPO" TEXT NOT NULL,
    "tanggalPO" TIMESTAMP(3) NOT NULL,
    "lokasiPO" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "POStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_nomorPO_key" ON "PurchaseOrder"("nomorPO");

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanLapangan_purchaseOrderId_key" ON "PermintaanLapangan"("purchaseOrderId");

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
