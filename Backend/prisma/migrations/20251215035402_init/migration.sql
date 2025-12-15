/*
  Warnings:

  - You are about to drop the `BudgetCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BudgetItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConfirmationDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConfirmationOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermintaanDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermintaanLapangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SignedBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SignedFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SigningAuthority` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "approval";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "enum";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "material";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "procurement";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "project";

-- CreateEnum
CREATE TYPE "enum"."ProjectStatus" AS ENUM ('PLANNING', 'ONGOING', 'HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "enum"."MRStatus" AS ENUM ('DRAFT', 'PENDING', 'PARTIAL', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "enum"."BoqType" AS ENUM ('MATERIAL', 'LABOR', 'EQUIPMENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."BudgetCategory" DROP CONSTRAINT "BudgetCategory_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BudgetCategory" DROP CONSTRAINT "BudgetCategory_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BudgetItem" DROP CONSTRAINT "BudgetItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BudgetItem" DROP CONSTRAINT "BudgetItem_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_confirmationOrderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConfirmationDetails" DROP CONSTRAINT "ConfirmationDetails_materialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_permintaanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConfirmationOrder" DROP CONSTRAINT "ConfirmationOrder_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materials" DROP CONSTRAINT "Materials_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materials" DROP CONSTRAINT "Materials_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermintaanDetails" DROP CONSTRAINT "PermintaanDetails_permintaanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermintaanLapangan" DROP CONSTRAINT "PermintaanLapangan_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_materialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_confirmationOrderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SignedBy" DROP CONSTRAINT "SignedBy_signedFileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SignedBy" DROP CONSTRAINT "SignedBy_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SigningAuthority" DROP CONSTRAINT "SigningAuthority_userId_fkey";

-- DropTable
DROP TABLE "public"."BudgetCategory";

-- DropTable
DROP TABLE "public"."BudgetItem";

-- DropTable
DROP TABLE "public"."Categories";

-- DropTable
DROP TABLE "public"."ConfirmationDetails";

-- DropTable
DROP TABLE "public"."ConfirmationOrder";

-- DropTable
DROP TABLE "public"."Materials";

-- DropTable
DROP TABLE "public"."PermintaanDetails";

-- DropTable
DROP TABLE "public"."PermintaanLapangan";

-- DropTable
DROP TABLE "public"."Project";

-- DropTable
DROP TABLE "public"."ProjectAssignment";

-- DropTable
DROP TABLE "public"."PurchaseDetails";

-- DropTable
DROP TABLE "public"."PurchaseOrder";

-- DropTable
DROP TABLE "public"."SignedBy";

-- DropTable
DROP TABLE "public"."SignedFile";

-- DropTable
DROP TABLE "public"."SigningAuthority";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."Vendors";

-- DropEnum
DROP TYPE "public"."FileType";

-- DropEnum
DROP TYPE "public"."ProjectRole";

-- DropEnum
DROP TYPE "public"."ProjectStatus";

-- DropEnum
DROP TYPE "public"."SigningRole";

-- DropEnum
DROP TYPE "public"."Status";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "auth"."AuthUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."AuthRole" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."AuthUserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "AuthUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."Project" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "contractNo" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."ProjectRole" (
    "id" TEXT NOT NULL,
    "roleName" TEXT,

    CONSTRAINT "ProjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."ProjectMember" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."Rab" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "totalBudget" DECIMAL(18,2),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."Boq" (
    "id" TEXT NOT NULL,
    "rabId" TEXT NOT NULL,
    "materialId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(65,30),
    "price" DECIMAL(18,2),
    "type" TEXT NOT NULL,

    CONSTRAINT "Boq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."boqType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "boqType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material"."Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material"."Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "image" TEXT,
    "code" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material"."Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material"."MaterialVendors" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "materialId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialVendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."MaterialRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "lokasi" TEXT,
    "picLapangan" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "MaterialRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."MaterialRequestItem" (
    "id" TEXT NOT NULL,
    "mRequestId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "boqId" TEXT NOT NULL,
    "qtyRequested" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "MaterialRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."Purchase" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "poDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."PurchaseItem" (
    "id" TEXT NOT NULL,
    "mrItemId" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."Delivery" (
    "id" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "deliveredBy" TEXT,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."DeliveryItem" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "mrItemId" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DeliveryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."GoodsReceipt" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "receivedBy" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement"."GRItem" (
    "id" TEXT NOT NULL,
    "grId" TEXT NOT NULL,
    "mrItemId" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "GRItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval"."ApprovalFlow" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "projectRoleId" TEXT NOT NULL,

    CONSTRAINT "ApprovalFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval"."ApprovalRecord" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "approvalFlowId" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ApprovalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_username_key" ON "auth"."AuthUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "auth"."AuthUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthRole_roleName_key" ON "auth"."AuthRole"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUserRole_userId_roleId_key" ON "auth"."AuthUserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "auth"."RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_employeeId_key" ON "project"."ProjectMember"("projectId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "material"."Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Material_code_key" ON "material"."Material"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialVendors_materialId_vendorId_key" ON "material"."MaterialVendors"("materialId", "vendorId");

-- CreateIndex
CREATE INDEX "ApprovalRecord_module_refId_idx" ON "approval"."ApprovalRecord"("module", "refId");

-- AddForeignKey
ALTER TABLE "auth"."AuthUserRole" ADD CONSTRAINT "AuthUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."AuthUserRole" ADD CONSTRAINT "AuthUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "auth"."AuthRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."ProjectMember" ADD CONSTRAINT "ProjectMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "project"."ProjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."Rab" ADD CONSTRAINT "Rab_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."Boq" ADD CONSTRAINT "Boq_rabId_fkey" FOREIGN KEY ("rabId") REFERENCES "project"."Rab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."Boq" ADD CONSTRAINT "Boq_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"."Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."Boq" ADD CONSTRAINT "Boq_type_fkey" FOREIGN KEY ("type") REFERENCES "project"."boqType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material"."Material" ADD CONSTRAINT "Material_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "material"."Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material"."MaterialVendors" ADD CONSTRAINT "MaterialVendors_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"."Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material"."MaterialVendors" ADD CONSTRAINT "MaterialVendors_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "material"."Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."MaterialRequest" ADD CONSTRAINT "MaterialRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."MaterialRequest" ADD CONSTRAINT "MaterialRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."MaterialRequestItem" ADD CONSTRAINT "MaterialRequestItem_mRequestId_fkey" FOREIGN KEY ("mRequestId") REFERENCES "procurement"."MaterialRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."MaterialRequestItem" ADD CONSTRAINT "MaterialRequestItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"."Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."MaterialRequestItem" ADD CONSTRAINT "MaterialRequestItem_boqId_fkey" FOREIGN KEY ("boqId") REFERENCES "project"."Boq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."Purchase" ADD CONSTRAINT "Purchase_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "auth"."AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."Purchase" ADD CONSTRAINT "Purchase_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "material"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."Purchase" ADD CONSTRAINT "Purchase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."PurchaseItem" ADD CONSTRAINT "PurchaseItem_mrItemId_fkey" FOREIGN KEY ("mrItemId") REFERENCES "procurement"."MaterialRequestItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."PurchaseItem" ADD CONSTRAINT "PurchaseItem_poId_fkey" FOREIGN KEY ("poId") REFERENCES "procurement"."Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."Delivery" ADD CONSTRAINT "Delivery_poId_fkey" FOREIGN KEY ("poId") REFERENCES "procurement"."Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."Delivery" ADD CONSTRAINT "Delivery_deliveredBy_fkey" FOREIGN KEY ("deliveredBy") REFERENCES "auth"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."DeliveryItem" ADD CONSTRAINT "DeliveryItem_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "procurement"."Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."DeliveryItem" ADD CONSTRAINT "DeliveryItem_mrItemId_fkey" FOREIGN KEY ("mrItemId") REFERENCES "procurement"."MaterialRequestItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "procurement"."Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "auth"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."GRItem" ADD CONSTRAINT "GRItem_grId_fkey" FOREIGN KEY ("grId") REFERENCES "procurement"."GoodsReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement"."GRItem" ADD CONSTRAINT "GRItem_mrItemId_fkey" FOREIGN KEY ("mrItemId") REFERENCES "procurement"."MaterialRequestItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval"."ApprovalFlow" ADD CONSTRAINT "ApprovalFlow_projectRoleId_fkey" FOREIGN KEY ("projectRoleId") REFERENCES "project"."ProjectRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval"."ApprovalRecord" ADD CONSTRAINT "ApprovalRecord_approvalFlowId_fkey" FOREIGN KEY ("approvalFlowId") REFERENCES "approval"."ApprovalFlow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval"."ApprovalRecord" ADD CONSTRAINT "ApprovalRecord_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "auth"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
