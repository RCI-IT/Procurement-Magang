/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Materials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Materials" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Materials_code_key" ON "Materials"("code");
