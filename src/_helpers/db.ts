import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { initAccount } from '../accounts/account.model';
import { initRefreshToken } from '../accounts/refresh-token.model';

const db: any = {};
export default db;

async function initialize() {
    const { host, port, user, password, database } = config.db;
    const connection = await mysql.createConnection({ host, port, user, password });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, {
        dialect: 'mysql'
    });

    db.Account = initAccount(sequelize);
    db.RefreshToken = initRefreshToken(sequelize);

    await sequelize.sync();
}

export { initialize };