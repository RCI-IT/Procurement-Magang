/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PODetails` table. All the data in the column will be lost.
  - You are about to drop the column `hargaSatuan` on the `PODetails` table. All the data in the column will be lost.
  - You are about to drop the column `totalHarga` on the `PODetails` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PODetails` table. All the data in the column will be lost.
  - Added the required column `code` to the `PODetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `satuan` to the `PODetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PODetails" DROP COLUMN "createdAt",
DROP COLUMN "hargaSatuan",
DROP COLUMN "totalHarga",
DROP COLUMN "updatedAt",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "keterangan" TEXT,
ADD COLUMN     "satuan" TEXT NOT NULL;
