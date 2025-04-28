/*
  Warnings:

  - You are about to drop the column `status` on the `PurchaseOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseDetails" ADD COLUMN     "status" "POStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "status";
