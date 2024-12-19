const logger = require('../utils/logger.js');
const {
    pool
} = require('../databases/db.js')

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


module.exports = {
    WhitelistDevelByIdOutlet
}