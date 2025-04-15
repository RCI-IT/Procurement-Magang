/*
  Warnings:

  - You are about to drop the column `purchaseOrderId` on the `PermintaanLapangan` table. All the data in the column will be lost.
  - You are about to drop the `PODetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[confirmationOrderId]` on the table `PermintaanLapangan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "COStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "PODetails" DROP CONSTRAINT "PODetails_permintaanDetailId_fkey";

-- DropForeignKey
ALTER TABLE "PODetails" DROP CONSTRAINT "PODetails_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_userId_fkey";

-- DropIndex
DROP INDEX "PermintaanLapangan_purchaseOrderId_key";

-- AlterTable
ALTER TABLE "PermintaanLapangan" DROP COLUMN "purchaseOrderId",
ADD COLUMN     "confirmationOrderId" INTEGER;

-- DropTable
DROP TABLE "PODetails";

-- DropTable
DROP TABLE "PurchaseOrder";

-- DropEnum
DROP TYPE "POStatus";

-- CreateTable
CREATE TABLE "ConfirmationOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomorCO" TEXT NOT NULL,
    "tanggalCO" TIMESTAMP(3) NOT NULL,
    "lokasiCO" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "COStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER,

    CONSTRAINT "ConfirmationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationDetails" (
    "id" SERIAL NOT NULL,
    "confirmationOrderId" INTEGER NOT NULL,
    "permintaanDetailId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "keterangan" TEXT,
    "satuan" TEXT NOT NULL,

    CONSTRAINT "ConfirmationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationOrder_nomorCO_key" ON "ConfirmationOrder"("nomorCO");

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanLapangan_confirmationOrderId_key" ON "PermintaanLapangan"("confirmationOrderId");

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_permintaanDetailId_fkey" FOREIGN KEY ("permintaanDetailId") REFERENCES "PermintaanDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
