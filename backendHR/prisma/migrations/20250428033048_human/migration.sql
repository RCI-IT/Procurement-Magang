-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ONLEAVE', 'RESIGN');

-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "idCardNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birth" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "leaveDate" DATE,
    "resignDate" DATE,
    "salary" INTEGER NOT NULL DEFAULT 0,
    "hireDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeDocuments" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "idCard" TEXT NOT NULL,
    "taxCard" TEXT,
    "familyCard" TEXT NOT NULL,
    "diploma" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSertification" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qualification" TEXT NOT NULL,
    "subQualification" TEXT NOT NULL,
    "certificateNo" TEXT,
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

    CONSTRAINT "EmployeeSertification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employees_employeeNumber_key" ON "Employees"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Employees_idCardNumber_key" ON "Employees"("idCardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Employees_email_key" ON "Employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employees_phone_key" ON "Employees"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeDocuments_employeeId_key" ON "EmployeeDocuments"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSertification_employeeId_key" ON "EmployeeSertification"("employeeId");

-- AddForeignKey
ALTER TABLE "EmployeeDocuments" ADD CONSTRAINT "EmployeeDocuments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSertification" ADD CONSTRAINT "EmployeeSertification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
