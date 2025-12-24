/*
  Warnings:

  - A unique constraint covering the columns `[projectId,employeeId,roleId]` on the table `ProjectMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleName]` on the table `ProjectRole` will be added. If there are existing duplicate values, this will fail.
  - Made the column `roleName` on table `ProjectRole` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Rab` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "auth"."AuthUserRole" DROP CONSTRAINT "AuthUserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."AuthUserRole" DROP CONSTRAINT "AuthUserRole_userId_fkey";

-- DropIndex
DROP INDEX "project"."ProjectMember_projectId_employeeId_key";

-- AlterTable
ALTER TABLE "project"."ProjectRole" ALTER COLUMN "roleName" SET NOT NULL;

-- AlterTable
ALTER TABLE "project"."Rab" ALTER COLUMN "createdBy" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_employeeId_roleId_key" ON "project"."ProjectMember"("projectId", "employeeId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRole_roleName_key" ON "project"."ProjectRole"("roleName");

-- AddForeignKey
ALTER TABLE "auth"."AuthUserRole" ADD CONSTRAINT "AuthUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."AuthUserRole" ADD CONSTRAINT "AuthUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "auth"."AuthRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."Rab" ADD CONSTRAINT "Rab_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "project"."ProjectMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
