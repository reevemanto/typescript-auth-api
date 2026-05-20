"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authorize;
const express_jwt_1 = __importDefault(require("express-jwt"));
const db_1 = __importDefault(require("../_helpers/db"));
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required in production');
}
const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (0, express_jwt_1.default)({ secret: jwtSecret, algorithms: ['HS256'] }),
        async (req, res, next) => {
            const account = await db_1.default.Account.findByPk(req.user.id);
            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.user.ownsToken = (token) => !!refreshTokens.find((x) => x.token === token);
            next();
        }
    ];
}
