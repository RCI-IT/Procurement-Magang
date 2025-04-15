-- AlterTable
ALTER TABLE "PermintaanLapangan" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
