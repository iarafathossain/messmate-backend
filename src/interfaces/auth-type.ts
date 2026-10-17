export interface IJwtPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface IRequestUser {
  userId: string;
  email: string;
  name: string;
}
