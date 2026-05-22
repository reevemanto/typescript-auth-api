import { DataTypes } from "sequelize";

export default function model(sequelize: any) {
    const attributes = {
        token: { type: DataTypes.STRING, allowNull: false },
        expires: { type: DataTypes.DATE, allowNull: false },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        createdByIp: { type: DataTypes.STRING, allowNull: false },
        revoked: { type: DataTypes.DATE, allowNull: true },
        revokedByIp: { type: DataTypes.STRING, allowNull: true },
        replacedByToken: { type: DataTypes.STRING, allowNull: true },
        accountId: { type: DataTypes.INTEGER, allowNull: false },
        isExpired: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
                return Date.now() >= new Date(this.expires).getTime();
            }
        },
        isActive: {
            type: DataTypes.VIRTUAL,
            get(this: any) {
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