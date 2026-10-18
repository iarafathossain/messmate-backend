export interface IJwtPayload {
  userId: string;
  email: string;
  name: string;
  role: TUserRole;
  iat?: number;
  exp?: number;
}

export interface IRequestUser {
  userId: string;
  email: string;
  name: string;
  role: TUserRole;
}

export const UserRoles = {
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
} as const;

export type TUserRole = (typeof UserRoles)[keyof typeof UserRoles];
