/*
  Warnings:

  - You are about to drop the `EmployeeSertification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmployeeSertification" DROP CONSTRAINT "EmployeeSertification_employeeId_fkey";

-- DropTable
DROP TABLE "EmployeeSertification";

-- CreateTable
CREATE TABLE "EmployeeCertification" (
    "id" TEXT NOT NULL,
    "certificate" TEXT,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qualification" TEXT NOT NULL,
    "subQualification" TEXT NOT NULL,
    "certificateNo" TEXT NOT NULL,
    "registrationNo" TEXT,
    "level" INTEGER,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "company" TEXT,
    "documentLink" TEXT,
    "account" TEXT,
    "password" TEXT,
    "sbu" TEXT,

    CONSTRAINT "EmployeeCertification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeCertification_certificateNo_key" ON "EmployeeCertification"("certificateNo");

-- AddForeignKey
ALTER TABLE "EmployeeCertification" ADD CONSTRAINT "EmployeeCertification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
