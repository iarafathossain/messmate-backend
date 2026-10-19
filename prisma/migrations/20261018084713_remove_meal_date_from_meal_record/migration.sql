/*
  Warnings:

  - You are about to drop the column `mealDate` on the `meal_records` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `meal_records` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "meal_records_mealDate_idx";

-- DropIndex
DROP INDEX "meal_records_messMemberId_mealDate_key";

-- AlterTable
ALTER TABLE "meal_records" DROP COLUMN "mealDate",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
