-- CreateEnum
CREATE TYPE "PDetailStatus" AS ENUM ('PENDING', 'ACC', 'REJECTED');

-- AlterTable
ALTER TABLE "PermintaanDetails" ADD COLUMN     "status" "PDetailStatus" NOT NULL DEFAULT 'PENDING';
