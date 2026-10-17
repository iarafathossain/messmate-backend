import bcrypt from "bcryptjs";
import status from "http-status";
import AppError from "../../errors/app-error";
import { prisma } from "../../libs/prisma";
import { tokenUtils } from "../../utils/token";
import { IMessRegisterPayload } from "./interfaces";

const checkUser = async (email: string) => {
  // check if the mess exists with the given email
  const user = await prisma.mess.findUnique({
    where: {
      email,
    },
  });

  return user;
};

const registerMess = async (payload: IMessRegisterPayload) => {
  // destructure the payload
  const { name, email, messType, password } = payload;

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

  // create a new mess
  const newUser = await prisma.mess.create({
    data: {
      name,
      email,
      passwordHash,
      messType,
    },
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
