/*
  Warnings:

  - You are about to drop the column `materialId` on the `PermintaanDetails` table. All the data in the column will be lost.
  - Added the required column `materialName` to the `PermintaanDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PermintaanDetails" DROP CONSTRAINT "PermintaanDetails_materialId_fkey";

-- AlterTable
ALTER TABLE "PermintaanDetails" DROP COLUMN "materialId",
ADD COLUMN     "materialName" TEXT NOT NULL;
