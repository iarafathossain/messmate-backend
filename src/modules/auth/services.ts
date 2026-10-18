import bcrypt from "bcryptjs";
import status from "http-status";
import AppError from "../../errors/app-error";
import { UserRoles } from "../../interfaces/auth-type";
import { prisma } from "../../libs/prisma";
import { generateMessCode } from "../../utils/generate-messcode";
import { getRoleOrThrow } from "../../utils/get-role";
import { tokenUtils } from "../../utils/token";
import { IMemberRegisterPayload, IMessRegisterPayload } from "./interfaces";

const checkUser = async (email: string) => {
  // check if the user exists with the given email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

const checkDuplicatePhone = async (phone: string) => {
  // check if the user exists with the given phone number
  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (user) {
    throw new AppError(
      status.CONFLICT,
      "User with the given phone number already exists",
    );
  }
};

const hashPassword = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, 10);

  return passwordHash;
};

const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase();
};

const normalizePhone = (phone: string) => {
  return phone.trim();
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
  // normalize the email
  const normalizedEmail = normalizeEmail(email);
  // normalize the phone number
  const normalizedPhone = normalizePhone(phone);

  // check if the phone number is already registered
  await checkDuplicatePhone(normalizedPhone);

  // hash the password
  const passwordHash = await hashPassword(password);

  // create the user, user-role, and mess in the database by using a transaction
  const newUser = await prisma.$transaction(async (prisma) => {
    // create the user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
      },
    });

    // get the roleId for the "manager" role
    const managerRole = await getRoleOrThrow(prisma, UserRoles.MANAGER);

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
        messCode: generateMessCode(),
      },
    });

    return { ...user, role: managerRole.name };
  });

  // omit the passwordHash before returning the user
  const { passwordHash: _passwordHash, ...userWithoutPassword } = newUser;

  // create access token
  const accessToken = tokenUtils.getAccessToken({
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  });

  return {
    user: userWithoutPassword,
    accessToken,
  };
};

const login = async (email: string, password: string) => {
  // check if the user exists
  const normalizedEmail = normalizeEmail(email);
  const user = await checkUser(normalizedEmail);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "Invalid credentials!");
  }

  // compare the password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials!");
  }

  // get the role of the user
  const userRole = await prisma.userRole.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      role: true,
    },
  });

  if (!userRole) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "User role not found");
  }

  // omit the passwordHash before returning the user
  const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

  // create access token
  const accessToken = tokenUtils.getAccessToken({
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name,
    role: userRole.role.name,
  });

  return {
    user: { ...userWithoutPassword, role: userRole.role.name },
    accessToken,
  };
};

const registerMember = async (payload: IMemberRegisterPayload) => {
  // destructure the payload
  const { name, email, phone, password, messCode } = payload;

  // check if the user already exists
  const existingUser = await checkUser(email);

  if (existingUser) {
    throw new AppError(
      status.CONFLICT,
      "User with the given email already exists",
    );
  }
  // normalize the email
  const normalizedEmail = normalizeEmail(email);

  // normalize the phone number
  const normalizedPhone = normalizePhone(phone);

  // check if the phone number is already registered
  await checkDuplicatePhone(normalizedPhone);

  // hash the password
  const passwordHash = await hashPassword(password);

  // create the user and user-role in the database by using a transaction
  const newUser = await prisma.$transaction(async (prisma) => {
    // find the mess by messCode
    const mess = await prisma.mess.findUnique({
      where: {
        messCode,
      },
    });

    if (!mess) {
      throw new AppError(status.NOT_FOUND, "Mess not found");
    }
    // create the user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
      },
    });

    // get the roleId for the "member" role
    const memberRole = await getRoleOrThrow(prisma, UserRoles.MEMBER);

    if (!memberRole) {
      throw new AppError(status.INTERNAL_SERVER_ERROR, "Member role not found");
    }

    // create the userRole for the user
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: memberRole.id,
      },
    });

    // create the messMember for the user
    await prisma.messMember.create({
      data: {
        userId: user.id,
        messId: mess.id,
      },
    });

    return { ...user, role: memberRole.name };
  });

  // omit the passwordHash before returning the user
  const { passwordHash: _passwordHash, ...userWithoutPassword } = newUser;

  // create access token
  const accessToken = tokenUtils.getAccessToken({
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name,
    role: userWithoutPassword.role,
  });

  return {
    user: userWithoutPassword,
    accessToken,
  };
};

export const authServices = {
  registerMess,
  login,
  registerMember,
};
