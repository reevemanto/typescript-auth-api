"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRefreshToken = initRefreshToken;
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("./account.model"));
class RefreshToken extends sequelize_1.Model {
    get isExpired() {
        return Date.now() >= this.expires.getTime();
    }
    get isActive() {
        return !this.revoked && !this.isExpired;
    }
}
function initRefreshToken(sequelize) {
    RefreshToken.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        token: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        expires: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        createdByIp: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        revoked: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        revokedByIp: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        replacedByToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
        updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW }
    }, {
        sequelize,
        tableName: 'refreshTokens'
    });
    // Define relationship
    account_model_1.default.hasMany(RefreshToken, { as: 'RefreshTokens', foreignKey: 'accountId' });
    RefreshToken.belongsTo(account_model_1.default, { foreignKey: 'accountId' });
    return RefreshToken;
}
exports.default = RefreshToken;
