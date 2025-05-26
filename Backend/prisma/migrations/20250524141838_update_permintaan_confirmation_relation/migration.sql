/*
  Warnings:

  - You are about to drop the column `confirmationOrderId` on the `PermintaanLapangan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_confirmationOrderId_fkey";

-- DropIndex
DROP INDEX "PermintaanLapangan_confirmationOrderId_key";

-- AlterTable
ALTER TABLE "ConfirmationOrder" ADD COLUMN     "permintaanId" INTEGER;

-- AlterTable
ALTER TABLE "PermintaanLapangan" DROP COLUMN "confirmationOrderId";

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
