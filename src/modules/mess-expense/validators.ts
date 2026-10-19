import * as zod from "zod";

export const expensePayloadSchema = zod.object({
  messId: zod.string().uuid(),
  expenseId: zod.string().uuid().optional(),
  description: zod.string().max(1000),
  amount: zod.number().positive(),
});

export type ExpensePayload = zod.infer<typeof expensePayloadSchema>;
