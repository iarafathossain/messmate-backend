import { MessType } from "../../generated/prisma/enums";

export interface IMessRegisterPayload {
  name: string;
  messName: string;
  email: string;
  password: string;
  messType: MessType;
  phone: string;
}
