import * as zod from "zod";

export const upsertMealRateZodSchema = zod
  .object({
    fullMealRate: zod
      .number()
      .min(0, "Full meal rate must be a non-negative number")
      .optional(),
    halfMealRate: zod
      .number()
      .min(0, "Half meal rate must be a non-negative number")
      .optional(),
  })
  .refine(
    (data) =>
      data.fullMealRate !== undefined || data.halfMealRate !== undefined,
    {
      message: "At least one of fullMealRate or halfMealRate must be provided",
      path: ["fullMealRate", "halfMealRate"],
    },
  );
