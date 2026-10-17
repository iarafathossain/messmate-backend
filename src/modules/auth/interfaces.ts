import { MessType } from "../../generated/prisma/enums";

export interface IMessRegisterPayload {
  name: string;
  email: string;
  password: string;
  messType: MessType;
}
