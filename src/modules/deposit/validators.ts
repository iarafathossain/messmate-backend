import * as zod from "zod";

export const upsertDepositZodSchema = zod.object({
  messMemberId: zod.string().uuid(),
  amount: zod.number().positive(),
  depositDate: zod.coerce.date(),
  note: zod.string().optional(),
});
