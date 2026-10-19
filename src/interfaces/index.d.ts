import { IRequestUser } from "./auth-type";

declare global {
  namespace Express {
    export interface Request {
      user?: IRequestUser;
    }
  }
}
