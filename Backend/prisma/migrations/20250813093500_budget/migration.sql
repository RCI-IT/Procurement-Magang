-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED', 'READ', 'COMPLETED', 'ACC');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER_PURCHASE', 'USER_LAPANGAN');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PERMINTAAN_LAPANGAN', 'CONFIRMATION_ORDER', 'PURCHASE_ORDER');

-- CreateEnum
CREATE TYPE "SigningRole" AS ENUM ('ENGINEER_REQUESTER', 'ENGINEER_CHECKER', 'LOGISTIC', 'PIC_LAPANGAN', 'PURCHASING', 'SITE_MANAGER', 'VENDOR', 'FINANCE', 'DIREKSI');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('BERJALAN', 'SELESAI', 'TERTUNDA', 'ONGOING');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('PM', 'PROCUREMENT', 'STAFF');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "contractNo" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "projectManager" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAssignment" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roleInProject" "ProjectRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT,
    "quantity" DOUBLE PRECISION,
    "frequency" INTEGER,
    "duration" INTEGER,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermintaanLapangan" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomor" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "lokasi" TEXT NOT NULL,
    "picLapangan" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" TEXT,
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "projectId" TEXT,

    CONSTRAINT "PermintaanLapangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationOrder" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomorCO" TEXT NOT NULL,
    "tanggalCO" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "permintaanId" INTEGER,
    "vendorId" INTEGER,

    CONSTRAINT "ConfirmationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomorPO" TEXT NOT NULL,
    "tanggalPO" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "confirmationOrderId" INTEGER NOT NULL,
    "userId" INTEGER,
    "projectId" TEXT,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationDetails" (
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "keterangan" TEXT,
    "satuan" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "mention" TEXT,
    "id" SERIAL NOT NULL,
    "confirmationOrderId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "ConfirmationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermintaanDetails" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "mention" TEXT,
    "code" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "id" SERIAL NOT NULL,
    "permintaanId" INTEGER NOT NULL,
    "materialName" TEXT NOT NULL,

    CONSTRAINT "PermintaanDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDetails" (
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "id" SERIAL NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materials" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendors" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER_LAPANGAN',
    "id" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignedBy" (
    "id" TEXT NOT NULL,
    "signedFileId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignedBy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignedFile" (
    "id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "relatedId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SigningAuthority" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "fileType" "FileType" NOT NULL,
    "role" "SigningRole" NOT NULL,

    CONSTRAINT "SigningAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAssignment_employeeId_projectId_key" ON "ProjectAssignment"("employeeId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanLapangan_nomor_key" ON "PermintaanLapangan"("nomor");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationOrder_nomorCO_key" ON "ConfirmationOrder"("nomorCO");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_nomorPO_key" ON "PurchaseOrder"("nomorPO");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_confirmationOrderId_key" ON "PurchaseOrder"("confirmationOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Materials_code_key" ON "Materials"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SignedFile_type_relatedId_key" ON "SignedFile"("type", "relatedId");

-- CreateIndex
CREATE UNIQUE INDEX "SigningAuthority_userId_fileType_role_key" ON "SigningAuthority"("userId", "fileType", "role");

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetCategory" ADD CONSTRAINT "BudgetCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BudgetCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BudgetCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationOrder" ADD CONSTRAINT "ConfirmationOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_confirmationOrderId_fkey" FOREIGN KEY ("confirmationOrderId") REFERENCES "ConfirmationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationDetails" ADD CONSTRAINT "ConfirmationDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedBy" ADD CONSTRAINT "SignedBy_signedFileId_fkey" FOREIGN KEY ("signedFileId") REFERENCES "SignedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedBy" ADD CONSTRAINT "SignedBy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SigningAuthority" ADD CONSTRAINT "SigningAuthority_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
