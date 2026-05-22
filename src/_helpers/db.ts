import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { initAccount } from '../accounts/account.model';
import { initRefreshToken } from '../accounts/refresh-token.model';

const db: any = {};
export default db;

async function initialize() {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306');
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'manto_db';

    console.log('Connecting to DB:', { host, port, user, database });

    const connection = await mysql.createConnection({ host, port, user, password });

    if (process.env.NODE_ENV !== 'production' && host === 'localhost') {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    }
    await connection.end();

    const sequelize = new Sequelize(database, user, password, {
        host: host,
        port: port,
        dialect: 'mysql',
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    });

    db.Account = initAccount(sequelize);
    db.RefreshToken = initRefreshToken(sequelize);

   // await sequelize.sync({ alter: false });
}

export { initialize };