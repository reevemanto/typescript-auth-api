"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = initialize;
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("../accounts/account.model"));
const refresh_token_model_1 = __importDefault(require("../accounts/refresh-token.model"));
const db = {};
exports.default = db;
async function initialize() {
    const host = process.env.DB_HOST;
    const port = parseInt(process.env.DB_PORT || '3306');
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    console.log('Connecting to DB:', { host, port, user, database });
    if (!host || !user || !password || !database) {
        throw new Error('Missing required database environment variables');
    }
    const sequelize = new sequelize_1.Sequelize(database, user, password, {
        host: host,
        port: port,
        dialect: 'mysql'
    });
    await sequelize.authenticate();
    console.log('DB connection established successfully.');
    db.Account = (0, account_model_1.default)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.default)(sequelize);
    db.Account.hasMany(db.RefreshToken, { foreignKey: 'accountId', onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account, { foreignKey: 'accountId' });
    await sequelize.sync();
    console.log('DB ready — tables already exist.');
}
