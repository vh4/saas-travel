const {
    Pool
} = require('pg');
const logger = require('../utils/logger.js');

const {
    DB_USERNAME,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_PORT
} = process.env;

if (!DB_USERNAME || !DB_HOST || !DB_DATABASE || !DB_PASSWORD || !DB_PORT) {
    logger.info(".env empty data !.")
    throw new Error('.env empty data !.');
}

const poolConfig = {
    user: DB_USERNAME,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
    max: 20,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 5000,
    ssl: false,
};

const pool = new Pool(poolConfig);

async function checkConnection(pool, poolName) {
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

async function dbCheck() {
    try {
        await Promise.all([
            checkConnection(pool, 'main'),
        ]);
    } catch (error) {
        logger.error(`Error databases: ${error}`);
    }
}

module.exports = {
    pool,
    dbCheck
};