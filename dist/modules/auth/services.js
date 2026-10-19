"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../errors/app-error"));
const auth_type_1 = require("../../interfaces/auth-type");
const prisma_1 = require("../../libs/prisma");
const generate_messcode_1 = require("../../utils/generate-messcode");
const get_role_1 = require("../../utils/get-role");
const token_1 = require("../../utils/token");
const checkUser = async (email) => {
    // check if the user exists with the given email
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
};
const checkDuplicatePhone = async (phone) => {
    // check if the user exists with the given phone number
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            phone,
        },
    });
    if (user) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, "User with the given phone number already exists");
    }
};
const hashPassword = async (password) => {
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    return passwordHash;
};
const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
};
const normalizePhone = (phone) => {
    return phone.trim();
};
const registerMess = async (payload) => {
    // destructure the payload
    const { name, messName, email, phone, messType, password } = payload;
    // check if the user already exists
    const existingUser = await checkUser(email);
    if (existingUser) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, "User with the given email already exists");
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
    const newUser = await prisma_1.prisma.$transaction(async (prisma) => {
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
        const managerRole = await (0, get_role_1.getRoleOrThrow)(prisma, auth_type_1.UserRoles.MESS);
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
                messCode: (0, generate_messcode_1.generateMessCode)(),
            },
        });
        return { ...user, role: managerRole.name };
    });
    // omit the passwordHash before returning the user
    const { passwordHash: _passwordHash, ...userWithoutPassword } = newUser;
    // create access token
    const accessToken = token_1.tokenUtils.getAccessToken({
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
const login = async (email, password) => {
    // check if the user exists
    const normalizedEmail = normalizeEmail(email);
    const user = await checkUser(normalizedEmail);
    if (!user) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Invalid credentials!");
    }
    // compare the password
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    // get the role of the user
    const userRole = await prisma_1.prisma.userRole.findUnique({
        where: {
            userId: user.id,
        },
        include: {
            role: true,
        },
    });
    if (!userRole) {
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "User role not found");
    }
    // omit the passwordHash before returning the user
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    // create access token
    const accessToken = token_1.tokenUtils.getAccessToken({
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
const registerMember = async (payload) => {
    // destructure the payload
    const { name, email, phone, password, messCode } = payload;
    // check if the user already exists
    const existingUser = await checkUser(email);
    if (existingUser) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, "User with the given email already exists");
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
    const newUser = await prisma_1.prisma.$transaction(async (prisma) => {
        // find the mess by messCode
        const mess = await prisma.mess.findUnique({
            where: {
                messCode,
            },
        });
        if (!mess) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, "Mess not found");
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
        const memberRole = await (0, get_role_1.getRoleOrThrow)(prisma, auth_type_1.UserRoles.MEMBER);
        if (!memberRole) {
            throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Member role not found");
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
    const accessToken = token_1.tokenUtils.getAccessToken({
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
exports.authServices = {
    registerMess,
    login,
    registerMember,
};
