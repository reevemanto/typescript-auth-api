"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAccount = initAccount;
const sequelize_1 = require("sequelize");
class Account extends sequelize_1.Model {
    get isVerified() {
        return this.verified !== null;
    }
}
function initAccount(sequelize) {
    Account.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
        passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        role: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'User' },
        verificationToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        verified: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        resetToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        resetTokenExpires: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
        updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW }
    }, {
        sequelize,
        tableName: 'accounts',
        defaultScope: { attributes: { exclude: ['passwordHash'] } },
        scopes: { withHash: { attributes: undefined } }
    });
    return Account;
}
exports.default = Account;
