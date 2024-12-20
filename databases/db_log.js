const {
    Pool
} = require('pg');
const logger = require('../utils/logger.js');

const {
    DB_USERNAME_LOG,
    DB_HOST_LOG,
    DB_DATABASE_LOG,
    DB_PASSWORD_LOG,
    DB_PORT_LOG
} = process.env;

if (!DB_USERNAME_LOG || !DB_HOST_LOG || !DB_DATABASE_LOG || !DB_PASSWORD_LOG || !DB_PORT_LOG) {
    logger.info(".env empty data !.")
    throw new Error('.env empty data !.');
}

const poolConfigLog = {
    user: DB_USERNAME_LOG,
    host: DB_HOST_LOG,
    database: DB_DATABASE_LOG,
    password: DB_PASSWORD_LOG,
    port: parseInt(DB_PORT_LOG, 10),
    max: 20,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 5000,
    ssl: false,
};

const poolLog = new Pool(poolConfigLog);

async function checkConnectionLog(pool, poolName) {
    let client = null;
    try {
        client = await pool.connect();
        await client.query('SELECT 1');
        logger.info(`Connected to database: ${poolName}`);
    } catch (error) {
        logger.error(`Connection error to database ${poolName}: ${error}`);
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function dbCheckLog() {
    try {
        await Promise.all([
            checkConnectionLog(poolLog, 'log'),
        ]);
    } catch (error) {
        logger.error(`Error databases: ${error}`);
    }
}

module.exports = {
    poolLog,
    dbCheckLog
};