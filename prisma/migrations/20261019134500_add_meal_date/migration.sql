ALTER TABLE "meal_records" ADD COLUMN "mealDate" DATE;

CREATE UNIQUE INDEX "meal_records_messMemberId_mealDate_key"
ON "meal_records"("messMemberId", "mealDate");

CREATE INDEX "meal_records_mealDate_idx" ON "meal_records"("mealDate");
