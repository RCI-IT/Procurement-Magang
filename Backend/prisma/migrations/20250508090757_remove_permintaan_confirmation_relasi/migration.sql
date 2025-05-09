/*
  Warnings:

  - You are about to drop the column `permintaanDetailId` on the `ConfirmationDetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_permintaanDetailId_fkey";

-- AlterTable
ALTER TABLE "ConfirmationDetails" DROP COLUMN "permintaanDetailId";
