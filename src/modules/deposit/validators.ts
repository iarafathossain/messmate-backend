import * as zod from "zod";

export const upsertDepositZodSchema = zod.object({
  messMemberId: zod.string().uuid(),
  amount: zod.number().positive(),
  note: zod.string().optional(),
});
