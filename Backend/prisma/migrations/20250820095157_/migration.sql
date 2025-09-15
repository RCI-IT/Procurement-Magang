/*
  Warnings:

  - A unique constraint covering the columns `[projectId,categoryId,description]` on the table `BudgetItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BudgetItem_projectId_categoryId_description_key" ON "BudgetItem"("projectId", "categoryId", "description");
