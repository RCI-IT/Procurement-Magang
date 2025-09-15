/*
  Warnings:

  - A unique constraint covering the columns `[certificateNo]` on the table `EmployeeSertification` will be added. If there are existing duplicate values, this will fail.
  - Made the column `certificateNo` on table `EmployeeSertification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "EmployeeSertification_employeeId_key";

-- AlterTable
ALTER TABLE "EmployeeSertification" ALTER COLUMN "certificateNo" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSertification_certificateNo_key" ON "EmployeeSertification"("certificateNo");
