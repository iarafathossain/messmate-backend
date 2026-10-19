export interface IUpsertDepositPayload {
  messMemberId: string;
  amount: number;
  depositDate: Date;
  note?: string;
  managerId?: string;
}
