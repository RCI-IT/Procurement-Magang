/*
  Warnings:

  - The values [ACC] on the enum `DetailStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DetailStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED', 'READ');
ALTER TABLE "ConfirmationDetails" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ConfirmationDetails" ALTER COLUMN "status" TYPE "DetailStatus_new" USING ("status"::text::"DetailStatus_new");
ALTER TYPE "DetailStatus" RENAME TO "DetailStatus_old";
ALTER TYPE "DetailStatus_new" RENAME TO "DetailStatus";
DROP TYPE "DetailStatus_old";
ALTER TABLE "ConfirmationDetails" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
