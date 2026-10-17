-- CreateEnum
CREATE TYPE "MessType" AS ENUM ('BOYS', 'GIRLS');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('FULL', 'HALF');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "depositDate" DATE NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "messId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "expenseDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_rates" (
    "id" UUID NOT NULL,
    "messId" UUID NOT NULL,
    "fullMealRate" DECIMAL(10,2) NOT NULL,
    "halfMealRate" DECIMAL(10,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_records" (
    "id" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "mealDate" DATE NOT NULL,
    "mealType" "MealType" NOT NULL,
    "mealRate" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "messId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mess" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "messType" "MessType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "deposits_memberId_depositDate_idx" ON "deposits"("memberId", "depositDate");

-- CreateIndex
CREATE INDEX "expenses_messId_expenseDate_idx" ON "expenses"("messId", "expenseDate");

-- CreateIndex
CREATE UNIQUE INDEX "meal_rates_messId_key" ON "meal_rates"("messId");

-- CreateIndex
CREATE INDEX "meal_records_mealDate_idx" ON "meal_records"("mealDate");

-- CreateIndex
CREATE UNIQUE INDEX "meal_records_memberId_mealDate_key" ON "meal_records"("memberId", "mealDate");

-- CreateIndex
CREATE INDEX "members_messId_idx" ON "members"("messId");

-- CreateIndex
CREATE UNIQUE INDEX "members_messId_email_key" ON "members"("messId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "members_messId_phone_key" ON "members"("messId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "mess_email_key" ON "mess"("email");

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_messId_fkey" FOREIGN KEY ("messId") REFERENCES "mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_rates" ADD CONSTRAINT "meal_rates_messId_fkey" FOREIGN KEY ("messId") REFERENCES "mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_records" ADD CONSTRAINT "meal_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_messId_fkey" FOREIGN KEY ("messId") REFERENCES "mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
