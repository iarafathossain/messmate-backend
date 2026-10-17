import bcrypt from "bcryptjs";
import status from "http-status";
import AppError from "../../errors/app-error";
import { prisma } from "../../libs/prisma";
import { tokenUtils } from "../../utils/token";
import { IMessRegisterPayload } from "./interfaces";

const checkUser = async (email: string) => {
  // check if the user exists with the given email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

const registerMess = async (payload: IMessRegisterPayload) => {
  // destructure the payload
  const { name, messName, email, phone, messType, password } = payload;

  // check if the user already exists
  const existingUser = await checkUser(email);

  if (existingUser) {
    throw new AppError(
      status.CONFLICT,
      "User with the given email already exists",
    );
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // create the user, user-role, and mess in the database by using a transaction
  const newUser = await prisma.$transaction(async (prisma) => {
    // create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
      },
    });

    // get the roleId for the "manager" role
    const managerRole = await prisma.role.findUnique({
      where: {
        name: "MANAGER",
      },
    });

    if (!managerRole) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Manager role not found",
      );
    }

    // create the userRole for the user
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: managerRole.id,
      },
    });

    // create the mess
    await prisma.mess.create({
      data: {
        messName,
        messType,
        managerId: user.id,
        messCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // generate a random 6-character alphanumeric code
      },
    });

    return user;
  });

  // omit the passwordHash before returning the user
  const { passwordHash: _passwordHash, ...userWithoutPassword } = newUser;

  // create access token
  const accessToken = tokenUtils.getAccessToken({
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name,
  });

  return {
    user: userWithoutPassword,
    accessToken,
  };
};

const loginMess = async (email: string, password: string) => {
  // check if the user exists
  const user = await checkUser(email);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  // compare the password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  // omit the passwordHash before returning the user
  const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

  // create access token
  const accessToken = tokenUtils.getAccessToken({
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name,
  });

  return {
    user: userWithoutPassword,
    accessToken,
  };
};

export const authServices = {
  registerMess,
  loginMess,
};
