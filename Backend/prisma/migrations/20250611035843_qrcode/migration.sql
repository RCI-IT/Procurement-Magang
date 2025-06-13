-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PERMINTAAN_LAPANGAN', 'CONFIRMATION_ORDER', 'PURCHASE_ORDER', 'PL', 'CO', 'PO');

-- CreateEnum
CREATE TYPE "SigningRole" AS ENUM ('ENGINEER_REQUESTER', 'ENGINEER_CHECKER', 'PIC_LAPANGAN', 'PURCHASING', 'SITE_MANAGER', 'VENDOR', 'FINANCE', 'DIREKSI');

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
CREATE UNIQUE INDEX "SignedFile_type_relatedId_key" ON "SignedFile"("type", "relatedId");

-- CreateIndex
CREATE UNIQUE INDEX "SigningAuthority_userId_fileType_role_key" ON "SigningAuthority"("userId", "fileType", "role");

-- AddForeignKey
ALTER TABLE "SignedBy" ADD CONSTRAINT "SignedBy_signedFileId_fkey" FOREIGN KEY ("signedFileId") REFERENCES "SignedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedBy" ADD CONSTRAINT "SignedBy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SigningAuthority" ADD CONSTRAINT "SigningAuthority_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
