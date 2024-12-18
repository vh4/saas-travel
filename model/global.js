const logger = require('../utils/logger.js');
const { pool } = require('../databases/db.js')


// const WhiteListtravelFunction = async (idoutlet) => {
    
// 	try {
//         const { rows } = await pool.query("SELECT * FROM fmss.global_setting WHERE kunci = 'allow_payment_travel'");

//         if (rows && rows.length > 0) {
//             const data = rows[0]?.nilai || '';
//             const arr = data.split(','); // Assuming data is a string and not null

//             // Logging the products found in the global setting
//             logger.info(`Global setting data allow_payment_travel ${idoutlet}: ${arr.join(', ')}`);

//             return arr.includes(idoutlet);
//         } else {
//             logger.info('No allow_payment_travel data found.');
//             return false;
//         }
//     } catch (error) {
//         logger.error(`Error allow_payment_travel: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         return false;
//     }
// };

const WhitelistDevelByIdOutlet = async (idoutlet, produk) => {
    try {

        const { rows } = await pool.query("SELECT * FROM fmss.saas_produk where id_outlet = $1 and produk = $2 and is_active = 1", [idoutlet, produk]);

        if (rows && rows.length > 0) {
            // Logging the products found in the global setting
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

// const IsSimulatetravelFunction = async () => {
    
// 	try {
//         const { rows } = await pool.query("SELECT * FROM fmss.global_setting WHERE kunci = 'allow_simulate_travel'");

//         if (rows && rows.length > 0) {
//             const data = rows[0]?.nilai || '';

//             // Logging the products found in the global setting
//             logger.info(`Global setting data allow_simulate_travel : ${data}`);

//             return data;

//         } else {
//             logger.info('No allow_simulate_travel data found.');
//             return false;
//         }
//     } catch (error) {
//         logger.error(`Error allow_simulate_travel: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         return false;
//     }
// };

module.exports = {
    // WhiteListtravelFunction,
    // IsSimulatetravelFunction,
    WhitelistDevelByIdOutlet
}