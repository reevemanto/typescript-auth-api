"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../_helpers/db"));
const send_email_1 = require("../_helpers/send-email");
const accountService = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    validateResetToken
};
exports.default = accountService;
let fileConfig = {};
if (process.env.NODE_ENV !== 'production') {
    try {
        const configPath = path_1.default.join(process.cwd(), 'config.json');
        if (fs_1.default.existsSync(configPath)) {
            fileConfig = JSON.parse(fs_1.default.readFileSync(configPath, 'utf8'));
        }
    }
    catch (err) {
        console.warn('Could not load config.json:', err);
    }
}
function getJwtSecret() {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required in production');
    }
    const secret = process.env.JWT_SECRET || fileConfig.secret;
    if (!secret)
        throw new Error('JWT secret is missing');
    return secret;
}
async function authenticate({ email, password, ipAddress }) {
    const account = await db_1.default.Account.scope('withHash').findOne({ where: { email } });
    if (!account || !account.verified || !bcryptjs_1.default.compareSync(password, account.passwordHash)) {
        throw new Error('Email or password is incorrect');
    }
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);
    await refreshToken.save();
    return {
        id: account.id,
        title: account.title,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        created: account.createdAt,
        updated: account.updatedAt,
        verified: account.verified,
        jwtToken,
        refreshToken: refreshToken.token
    };
}
async function refreshToken({ token, ipAddress }) {
    const refreshToken = await db_1.default.RefreshToken.findOne({ where: { token }, include: ['Account'] });
    if (!refreshToken || !refreshToken.isActive) {
        throw new Error('Invalid token');
    }
    const account = refreshToken.Account;
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = new Date();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();
    const jwtToken = generateJwtToken(account);
    return {
        account: account.toJSON(),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}
async function revokeToken({ token, ipAddress }) {
    const refreshToken = await db_1.default.RefreshToken.findOne({ where: { token } });
    if (!refreshToken || !refreshToken.isActive) {
        throw new Error('Invalid token');
    }
    refreshToken.revoked = new Date();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}
async function register(params, origin) {
    if (await db_1.default.Account.findOne({ where: { email: params.email } })) {
        throw new Error('Email is already registered');
    }
    const account = new db_1.default.Account(params);
    const isFirstAccount = (await db_1.default.Account.count()) === 0;
    account.role = isFirstAccount ? 'Admin' : 'User';
    account.verificationToken = crypto_1.default.randomBytes(32).toString('hex');
    account.passwordHash = bcryptjs_1.default.hashSync(params.password, 10);
    await account.save();
    const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}`;
    const html = `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`;
    await (0, send_email_1.sendEmail)(account.email, 'Verify Email', html);
    console.log(`Verification email sent to ${account.email}`);
}
async function verifyEmail({ token }) {
    const account = await db_1.default.Account.findOne({ where: { verificationToken: token } });
    if (!account) {
        throw new Error('Verification failed');
    }
    account.verified = new Date();
    account.verificationToken = null;
    await account.save();
}
async function forgotPassword({ email }, origin) {
    const account = await db_1.default.Account.findOne({ where: { email } });
    if (!account)
        return;
    account.resetToken = crypto_1.default.randomBytes(32).toString('hex');
    account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await account.save();
    const resetUrl = `${origin}/account/reset-password?token=${account.resetToken}`;
    const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
    await (0, send_email_1.sendEmail)(account.email, 'Reset Password', html);
    console.log(`Password reset email sent to ${account.email}`);
}
async function resetPassword({ token, password }) {
    const account = await db_1.default.Account.findOne({
        where: { resetToken: token, resetTokenExpires: { [sequelize_1.Op.gt]: new Date() } }
    });
    if (!account) {
        throw new Error('Invalid token');
    }
    account.passwordHash = bcryptjs_1.default.hashSync(password, 10);
    account.resetToken = null;
    account.resetTokenExpires = null;
    await account.save();
}
async function getAll() {
    return await db_1.default.Account.findAll();
}
async function getById(id) {
    const account = await db_1.default.Account.findByPk(id);
    if (!account)
        throw new Error('Account not found');
    return account;
}
async function create(params) {
    if (await db_1.default.Account.findOne({ where: { email: params.email } })) {
        throw new Error('Email is already registered');
    }
    const account = new db_1.default.Account(params);
    account.verified = new Date();
    account.passwordHash = bcryptjs_1.default.hashSync(params.password, 10);
    await account.save();
    return account;
}
async function update(id, params) {
    const account = await getById(id);
    if (params.email && account.email !== params.email && await db_1.default.Account.findOne({ where: { email: params.email } })) {
        throw new Error('Email is already taken');
    }
    if (params.password) {
        params.passwordHash = bcryptjs_1.default.hashSync(params.password, 10);
        delete params.password;
    }
    Object.assign(account, params);
    await account.save();
    return account;
}
async function _delete(id) {
    const account = await getById(id);
    await db_1.default.RefreshToken.destroy({ where: { accountId: id } });
    await account.destroy();
}
function generateJwtToken(account) {
    return jsonwebtoken_1.default.sign({ sub: account.id, id: account.id }, getJwtSecret(), { expiresIn: '15m' });
}
function generateRefreshToken(account, ipAddress) {
    return new db_1.default.RefreshToken({
        accountId: account.id,
        token: crypto_1.default.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}
async function validateResetToken(token) {
    const account = await db_1.default.Account.findOne({
        where: { resetToken: token, resetTokenExpires: { [sequelize_1.Op.gt]: new Date() } }
    });
    if (!account)
        throw new Error('Invalid token');
    return account;
}
