const logger = require('../utils/logger.js');
const moment = require('moment');

const {
    pool
} = require('../databases/db.js')

const {
    poolLog
} = require('../databases/db_log.js')

const WhitelistDevelByIdOutlet = async (idoutlet, produk) => {
    try {

        const {
            rows
        } = await pool.query("SELECT * FROM fmss.saas_produk where id_outlet = $1 and produk = $2 and is_active = 1", [idoutlet, produk]);

        if (rows && rows.length > 0) {
            logger.info(`Global setting data WhitelistDevelByIdOutlet ${idoutlet} with produk ${produk}`);
            return true;
        } else {
            logger.info(`${idoutlet} with produk ${produk} => No WhitelistDevelByIdOutlet data found.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error WhitelistDevelByIdOutlet ${idoutlet} with produk ${produk}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}

const WhitelistDLU = async () => {
    try {

        const {
            rows
        } = await pool.query("select * from global_data_h2h gdhh where kunci = 'outlet_allow_saas_dlu'");

        if (rows && rows.length > 0) {
            return rows[0].nilai;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}


const log_request = async (id_log, ip_src, id_outlet, mid, raw_message) => {
    const date_request = moment().format("YYYY-MM-DD");
    const time_request = moment().format("HH:mm:ss");

    try {
        const query = `
            INSERT INTO log_request(
                id_log, ip_src, id_outlet, mid, date_request, time_request, raw_message
            ) VALUES($1, $2, $3, $4, $5, $6, $7);
        `;

        await poolLog.query(query, [
            id_log,
            ip_src,
            id_outlet,
            mid,
            date_request,
            time_request,
            raw_message,
        ]);

        logger.info(
            `Log request berhasil dimasukkan untuk id_outlet: ${id_outlet}, mid: ${mid}, raw_message: ${raw_message}`
        );
    } catch (error) {
        logger.error(
            `Gagal memasukkan log request untuk id_outlet: ${id_outlet}, mid: ${mid}. Error: ${
                error instanceof Error ? error.message : "Unknown error"
            }. Stack: ${error instanceof Error ? error.stack : "No stack available"}`
        );
    }
};

const log_response = async (id_log, ip_src, id_outlet, mid, raw_message) => {
    const date_response = moment().format("YYYY-MM-DD");
    const time_response = moment().format("HH:mm:ss");

    try {
        const query = `
            INSERT INTO log_response(
                id_log, ip_src, id_outlet, mid, date_response, time_response, raw_message
            ) VALUES($1, $2, $3, $4, $5, $6, $7);
        `;

        await poolLog.query(query, [
            id_log,
            ip_src,
            id_outlet,
            mid,
            date_response,
            time_response,
            raw_message,
        ]);

        logger.info(
            `Log response berhasil dimasukkan untuk id_outlet: ${id_outlet}, mid: ${mid}, raw_message: ${raw_message}`
        );
    } catch (error) {
        logger.error(
            `Gagal memasukkan log response untuk id_outlet: ${id_outlet}, mid: ${mid}. Error: ${
                error instanceof Error ? error.message : "Unknown error"
            }. Stack: ${error instanceof Error ? error.stack : "No stack available"}`
        );
    }
};

module.exports = {
    WhitelistDevelByIdOutlet,
    log_request,
    log_response,
    WhitelistDLU
}