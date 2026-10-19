/*
  Warnings:

  - You are about to drop the column `name` on the `messes` table. All the data in the column will be lost.
  - Added the required column `messName` to the `messes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messes" DROP COLUMN "name",
ADD COLUMN     "messName" TEXT NOT NULL;
