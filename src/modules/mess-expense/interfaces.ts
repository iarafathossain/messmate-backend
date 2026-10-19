export interface IUpsertExpensePayload {
  expenseId?: string;
  messId: string;
  description: string;
  amount: number;
  managerId: string;
}
