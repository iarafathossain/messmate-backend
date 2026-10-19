import * as zod from "zod";
import { MealType } from "../../generated/prisma/enums";

export const upsertMealRecordZodSchema = zod.object({
  messMemberId: zod.string().uuid(),
  mealRecordId: zod.string().uuid().optional(),
  mealType: zod.enum(MealType),
  mealDate: zod.string().date(),
  mealRate: zod.number().nonnegative().optional(),
});
