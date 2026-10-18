import status from "http-status";
import AppError from "../errors/app-error";
import { Prisma } from "../generated/prisma/client";
import { TUserRole } from "../interfaces/auth-type";

export const getRoleOrThrow = async (
  tx: Prisma.TransactionClient,
  roleName: TUserRole,
) => {
  const role = await tx.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Required role '${roleName}' is not configured`,
    );
  }

  return role;
};
