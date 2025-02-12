-- AlterTable
ALTER TABLE "Materials" ALTER COLUMN "image" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PermintaanLapangan" (
    "id" SERIAL NOT NULL,
    "nomor" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "lokasi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermintaanLapangan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanLapangan_nomor_key" ON "PermintaanLapangan"("nomor");
