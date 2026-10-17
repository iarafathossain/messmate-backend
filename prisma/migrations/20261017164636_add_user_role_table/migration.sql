/*
  Warnings:

  - You are about to drop the column `memberId` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `meal_records` table. All the data in the column will be lost.
  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mess` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[messMemberId,mealDate]` on the table `meal_records` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messMemberId` to the `deposits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messMemberId` to the `meal_records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_memberId_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_messId_fkey";

-- DropForeignKey
ALTER TABLE "meal_rates" DROP CONSTRAINT "meal_rates_messId_fkey";

-- DropForeignKey
ALTER TABLE "meal_records" DROP CONSTRAINT "meal_records_memberId_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_messId_fkey";

-- DropIndex
DROP INDEX "deposits_memberId_depositDate_idx";

-- DropIndex
DROP INDEX "meal_records_memberId_mealDate_key";

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "memberId",
DROP COLUMN "updatedAt",
ADD COLUMN     "messMemberId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "meal_records" DROP COLUMN "memberId",
ADD COLUMN     "messMemberId" UUID NOT NULL;

-- DropTable
DROP TABLE "members";

-- DropTable
DROP TABLE "mess";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "mess_members" (
    "id" UUID NOT NULL,
    "messId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mess_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "messCode" TEXT NOT NULL,
    "messType" "MessType" NOT NULL,
    "managerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "mess_members_userId_key" ON "mess_members"("userId");

-- CreateIndex
CREATE INDEX "mess_members_messId_idx" ON "mess_members"("messId");

-- CreateIndex
CREATE UNIQUE INDEX "messes_messCode_key" ON "messes"("messCode");

-- CreateIndex
CREATE UNIQUE INDEX "messes_managerId_key" ON "messes"("managerId");

-- CreateIndex
CREATE INDEX "deposits_messMemberId_depositDate_idx" ON "deposits"("messMemberId", "depositDate");

-- CreateIndex
CREATE UNIQUE INDEX "meal_records_messMemberId_mealDate_key" ON "meal_records"("messMemberId", "mealDate");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_messMemberId_fkey" FOREIGN KEY ("messMemberId") REFERENCES "mess_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_messId_fkey" FOREIGN KEY ("messId") REFERENCES "messes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_rates" ADD CONSTRAINT "meal_rates_messId_fkey" FOREIGN KEY ("messId") REFERENCES "messes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_records" ADD CONSTRAINT "meal_records_messMemberId_fkey" FOREIGN KEY ("messMemberId") REFERENCES "mess_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mess_members" ADD CONSTRAINT "mess_members_messId_fkey" FOREIGN KEY ("messId") REFERENCES "messes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mess_members" ADD CONSTRAINT "mess_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messes" ADD CONSTRAINT "messes_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
