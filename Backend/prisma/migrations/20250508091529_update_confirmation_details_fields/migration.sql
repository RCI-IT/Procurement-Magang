/*
  Warnings:

  - Added the required column `materialId` to the `ConfirmationDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConfirmationDetails" ADD COLUMN     "materialId" INTEGER NOT NULL,
ADD COLUMN     "mention" TEXT;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
