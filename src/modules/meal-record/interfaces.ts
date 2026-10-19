import { MealType } from "../../generated/prisma/enums";

export interface IUpsertMealRecordPayload {
  messMemberId: string;
  mealRecordId?: string;
  managerId: string;
  mealType: MealType;
  mealDate: string;
  mealRate?: number;
}
