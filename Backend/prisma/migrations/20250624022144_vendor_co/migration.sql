/*
  Warnings:

  - You are about to drop the column `vendorId` on the `PurchaseOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_vendorId_fkey";

-- AlterTable
ALTER TABLE "ConfirmationOrder" ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "vendorId";

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
