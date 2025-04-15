/*
  Warnings:

  - The values [PROCESSING,COMPLETED] on the enum `PermintaanStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('PENDING', 'CLOSED', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'IN_PROGRESS', 'READ');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "COStatus" ADD VALUE 'CLOSED';
ALTER TYPE "COStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "COStatus" ADD VALUE 'READ';

-- AlterEnum
BEGIN;
CREATE TYPE "PermintaanStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED', 'READ');
ALTER TABLE "PermintaanLapangan" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PermintaanLapangan" ALTER COLUMN "status" TYPE "PermintaanStatus_new" USING ("status"::text::"PermintaanStatus_new");
ALTER TYPE "PermintaanStatus" RENAME TO "PermintaanStatus_old";
ALTER TYPE "PermintaanStatus_new" RENAME TO "PermintaanStatus";
DROP TYPE "PermintaanStatus_old";
ALTER TABLE "PermintaanLapangan" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomorPO" TEXT NOT NULL,
    "tanggalPO" TIMESTAMP(3) NOT NULL,
    "lokasiPO" TEXT NOT NULL,
    "status" "POStatus" NOT NULL DEFAULT 'PENDING',
    "keterangan" TEXT,
    "confirmationOrderId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDetails" (
    "id" SERIAL NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "PurchaseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_nomorPO_key" ON "PurchaseOrder"("nomorPO");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_confirmationOrderId_key" ON "PurchaseOrder"("confirmationOrderId");

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
