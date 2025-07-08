/*
  Warnings:

  - You are about to drop the column `lokasiPO` on the `PurchaseOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "lokasiPO",
ADD COLUMN     "vendorId" INTEGER;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
