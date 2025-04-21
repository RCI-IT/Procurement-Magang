-- CreateEnum
CREATE TYPE "DetailStatus" AS ENUM ('PENDING', 'ACC', 'REJECTED');

-- AlterTable
ALTER TABLE "ConfirmationDetails" ADD COLUMN     "status" "DetailStatus" NOT NULL DEFAULT 'PENDING';
