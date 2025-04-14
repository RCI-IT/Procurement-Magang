-- CreateEnum
CREATE TYPE "PermintaanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER_PURCHASE', 'USER_LAPANGAN');

-- CreateTable
CREATE TABLE "PermintaanLapangan" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomor" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "lokasi" TEXT NOT NULL,
    "picLapangan" TEXT NOT NULL,
    "status" "PermintaanStatus" NOT NULL DEFAULT 'PENDING',
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" TEXT,
    "purchaseOrderId" INTEGER,

    CONSTRAINT "PermintaanLapangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomorPO" TEXT NOT NULL,
    "tanggalPO" TIMESTAMP(3) NOT NULL,
    "lokasiPO" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "POStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PODetails" (
    "id" SERIAL NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "permintaanDetailId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "keterangan" TEXT,
    "satuan" TEXT NOT NULL,

    CONSTRAINT "PODetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermintaanDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "permintaanId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "mention" TEXT,
    "code" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "PermintaanDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materials" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendors" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,

    CONSTRAINT "Vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER_LAPANGAN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanLapangan_nomor_key" ON "PermintaanLapangan"("nomor");

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanLapangan_purchaseOrderId_key" ON "PermintaanLapangan"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_nomorPO_key" ON "PurchaseOrder"("nomorPO");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PermintaanLapangan" ADD CONSTRAINT "PermintaanLapangan_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PODetails" ADD CONSTRAINT "PODetails_permintaanDetailId_fkey" FOREIGN KEY ("permintaanDetailId") REFERENCES "PermintaanDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PODetails" ADD CONSTRAINT "PODetails_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanDetails" ADD CONSTRAINT "PermintaanDetails_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanLapangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
