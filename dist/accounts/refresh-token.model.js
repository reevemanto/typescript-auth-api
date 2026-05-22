"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = model;
const sequelize_1 = require("sequelize");
function model(sequelize) {
    const attributes = {
        token: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        expires: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        created: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
        createdByIp: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        revoked: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        revokedByIp: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        replacedByToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        isExpired: {
            type: sequelize_1.DataTypes.VIRTUAL,
            get() {
                return Date.now() >= new Date(this.expires).getTime();
            }
        },
        isActive: {
            type: sequelize_1.DataTypes.VIRTUAL,
            get() {
                return !this.revoked && !this.isExpired;
            }
        }
    };
    const options = {
        timestamps: false,
        tableName: 'refreshTokens'
    };
    return sequelize.define('RefreshToken', attributes, options);
}
