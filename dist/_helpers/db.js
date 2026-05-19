"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = initialize;
const config_json_1 = __importDefault(require("../../config.json"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const account_model_1 = require("../accounts/account.model");
const refresh_token_model_1 = require("../accounts/refresh-token.model");
const db = {};
exports.default = db;
async function initialize() {
    const { host, port, user, password, database } = config_json_1.default.db;
    const connection = await promise_1.default.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    await connection.end();
    const sequelize = new sequelize_1.Sequelize(database, user, password, {
        dialect: 'mysql'
    });
    db.Account = (0, account_model_1.initAccount)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.initRefreshToken)(sequelize);
    await sequelize.sync();
}
