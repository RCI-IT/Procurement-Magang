/*
  Warnings:

  - Added the required column `permintaanId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_purchaseOrderId_fkey";

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "permintaanId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
