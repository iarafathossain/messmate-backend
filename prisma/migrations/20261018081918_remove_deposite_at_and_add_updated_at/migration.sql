/*
  Warnings:

  - You are about to drop the column `depositDate` on the `deposits` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "deposits_messMemberId_depositDate_idx";

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "depositDate",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
