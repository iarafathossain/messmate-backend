/*
  Warnings:

  - You are about to drop the column `expenseDate` on the `expenses` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "expenses_messId_expenseDate_idx";

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "expenseDate",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
