/*
  Warnings:

  - You are about to drop the column `image` on the `EmployeeSertification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeSertification" DROP COLUMN "image",
ADD COLUMN     "certificate" TEXT;
