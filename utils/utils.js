const fs = require('fs');
const logger = require('./logger');
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
const useragent = require('express-useragent');
const axios = require('axios');
const {
    jwtDecode
} = require('jwt-decode');
const {
    WhitelistDevelByIdOutlet,
    log_request,
    log_response
} = require('../model/global');

function parseOtomax(data) {
    let resp = [];

    for (const [key, value] of Object.entries(data)) {
        const firstUpperCaseDiKey = key.charAt(0).toUpperCase() + key.slice(1);
        const keyFinal = firstUpperCaseDiKey.split('_').join(" ");

        if (typeof value === 'number' && (key !== 'trxid')) {
            resp.push(`${keyFinal}:Rp${value}`);
        } else {
            resp.push(`${keyFinal}:${value}`);
        }
    }

    return resp.join(",");
}

async function axiosSendCallbackPayment(req, method, id_transaksi, type = '') {

    try {

        //getting data from session
        const uidpin = req.session['v_session_uid_pin'].split('|') || [];
        const uid = uidpin[0] || null;
        const pin = uidpin[1] || null;

        //data merchant
        const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
        const urlCallback = parseDataKhususMerchant?.url;
        const send_format = parseDataKhususMerchant?.data1; //format json / text.

        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        let getResponseGlobal = null;
        if (send_format?.toUpperCase() == 'JSON') {

            logger.info(`REQUEST HIT API RAJABILLER (Production)[JSON] /travel/${type}/payment : ${JSON.stringify({
                method: method,
                uid:uid,
                pin:'----',
                trxid:id_transaksi
            })}`);
            const url = 'https://rajabiller.fastpay.co.id/transaksi/api_json.php';

            //GETTING DATA CALLBACK FROM RAJABILLER
            getResponseGlobal = await axios.post(url, {
                method: method,
                uid: uid,
                pin: pin,
                trxid: id_transaksi
            });
            logger.info(`RESPONSE HIT API RAJABILLER (Production)[JSON] /travel/${type}/payment : ${JSON.stringify(getResponseGlobal.data)}`);

        } else {

            const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;

            logger.info(`REQUEST HIT API RAJABILLER (Production)[OTOMAX] /travel/${type}/payment: https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`);
            getResponseGlobal = await axios.get(url);
            logger.info(`RESPONSE HIT API RAJABILLER (Production)[OTOMAX] /travel/${type}/payment: ${JSON.stringify(getResponseGlobal.data)}`);

        }

        logger.info(`[REQUEST KIRIM KE-3 SENT CALLBACK TO MERCHANT USERNAME => ${username}, MERCHANT => ${merchart} (axiosSendCallbackPayment)] [${type}] URL ${urlCallback} : ${JSON.stringify(getResponseGlobal.data)}`);
        await log_request(id_transaksi, req.ip, uid, id_transaksi, `REQUEST CALLBACK KE-3 USERNAME => ${username}, MERCHANT => ${merchart} => ${JSON.stringify(getResponseGlobal.data)}`);

        const sendCallbackTomerchant = await axios.post(
            urlCallback,
            getResponseGlobal.data || null
        );
        logger.info(`[RESPONSE KIRIM KE-3 SENT CALLBACK TO MERCHANT USERNAME => ${username}, MERCHANT => ${merchart} (axiosSendCallbackPayment)] [${type}] URL ${urlCallback}: ${JSON.stringify(sendCallbackTomerchant.data)}`);
        await log_response(id_transaksi, req.ip, uid, id_transaksi, `RESPONSE CALLBACK KE-3 USERNAME => ${username}, MERCHANT => ${merchart} => ${JSON.stringify(sendCallbackTomerchant.data)}`);

        //redturn response dari payment api rb bukan mitra.
        return getResponseGlobal.data;


    } catch (error) {

        logger.error(`Error id_transaksi =>${id_transaksi}, [${type}][FUNCTION] axiosSendCallbackPayment: ${error.message}`);
        return {
            rc: '68',
            rd: 'Internal Server Error.'
        };

    }

}

async function processCallbackSaldoTerpotong(urlCallback, requestData, uid, ip, trx_id = null, username, merchart) {
    logger.info(`REQUEST KIRIM KE-2 SENT CALLBACK TO MERCHANT USERNAME => ${username}, MERCHANT => ${merchart} (processCallbackSaldoTerpotong): ${JSON.stringify(requestData)}`);
    await log_request(trx_id, ip, uid, trx_id, `REQUEST CALLBACK KE-2 USERNAME => ${username}, MERCHANT => ${merchart} => ${JSON.stringify(requestData)}`);

    const response = await axios.post(urlCallback, requestData);
    logger.info(`RESPONSE KIRIM KE-2 SENT CALLBACK TO MERCHANT USERNAME => ${username}, MERCHANT => ${merchart}  (processCallbackSaldoTerpotong): ${JSON.stringify(response.data)}`);
    await log_response(trx_id, ip, uid, trx_id, `RESPONSE CALLBACK KE-2 USERNAME => ${username}, MERCHANT => ${merchart} => ${JSON.stringify(response.data)}`);

    return response.data;
}



async function processPayment(req, data, uid, isProd, method, type, hardcodeCallback, hardCodePayment) {

    //data merchant
    const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
    const urlCallback = parseDataKhususMerchant?.url;
    const send_format = parseDataKhususMerchant?.data1;

    const merchart = req.session['v_merchant'];
    const username = req.session['v_uname'];

    let requestCallbackSaldoTerpotong = {
        trxid: data.transactionId,
        saldo_terpotong_mitra: data.saldo_terpotong_mitra,
        saldo_terpotong_merchant: data.saldo_terpotong_merchant,
        username: data.username,
        merchant: data.merchant
    };

    //for otomax format.
    if (send_format?.toUpperCase() == 'TEXT') {
        requestCallbackSaldoTerpotong = parseOtomax(requestCallbackSaldoTerpotong);
    }


    const responseMitra = await processCallbackSaldoTerpotong(urlCallback, requestCallbackSaldoTerpotong, uid, req.ip, data.transactionId, username, merchart);
    let parts = responseMitra.split(".") || [];

    if (parts.length < 3) {
        return {
            rc: "13",
            rd: "Invalid format callback!",
        };
    }

    const splitResponse = [
        parts[0],
        parts[1],
        parts.slice(2).join("."),
    ];

    if (splitResponse[0] !== 'okpayment' || parseInt(splitResponse[1]) !== parseInt(data.transactionId)) {
        return {
            rc: '13',
            rd: splitResponse[2]
        };
    }

    if (isProd) {
        const responseCallback = await axiosSendCallbackPayment(req, method, data.transactionId, type);


        if (send_format?.toUpperCase() === 'JSON') {

            return {
                rc: responseCallback.rc,
                rd: responseCallback.status,
                data: responseCallback.rc == '00' ? {
                    transaction_id: responseCallback.trxid,
                    url_etiket: responseCallback.url_etiket,
                    url_struk: responseCallback.url_struk,
                    nominal: responseCallback.tagihan,
                    komisi_mitra: responseCallback.komisi_mitra,
                    komisi_merchant: responseCallback.komisi_merchant,
                    total_komisi: responseCallback.total_komisi
                } : null
            };

        } else {

            //regex for otomax 
			const regex = /RC:(.*?),Status:(.*?),Username:(.*?),Merchant:(.*?),Total komisi:Rp(.*?),Komisi mitra:Rp(.*?),Komisi merchant:Rp(.*?),Saldo terpotong mitra:Rp(.*?),Saldo terpotong merchant:Rp(.*?)$/;

			const match = responseCallback.match(regex);
			
			if (match) {
				const data = {
					rc: match[1],
					rd: match[2],
					data: {
						username: match[3],
						merchant: match[4],
						total_komisi: parseInt(match[5], 10),
						komisi_mitra: parseInt(match[6], 10),
						komisi_merchant: parseInt(match[7], 10),
						saldo_terpotong_mitra: parseInt(match[8], 10),
						saldo_terpotong_merchant: parseInt(match[9], 10)
					}
				};
			
				logger.info(`[REGEX DATA PAYMENTS (axiosSendCallback)] username => ${match[3]} merchant => ${match[4]}  =  ${JSON.stringify(data)}`);
				return data;
			}
			
        }

    } else {
        // logger.info(`Requests HIT API TRAVEL (Development): ${JSON.stringify(data)}`);
        // const response = await axios.post(`${process.env.URL_HIT}/${type}/payment`, data);
        // logger.info(`Response HIT API TRAVEL (Development): ${JSON.stringify(response.data)}`);

        // Kirim callback payment dengan hardcode
        logger.info(`REQUEST KIRIM KE-3 SENT CALLBACK TO MERCHANT  DEVEL USERNAME => ${username}, MERCHANT => ${merchart} (axiosSendCallbackPayment): ${JSON.stringify(hardcodeCallback)}`);
        await log_request(data.transactionId, req.ip, uid, data.transactionId, `REQUEST CALLBACK KE-3 DEVEL => ${JSON.stringify(hardcodeCallback)}`);

        // hardcodeCallback.trxid = data.transactionId;
        const responseCallbackDevel = await axios.post(urlCallback, hardcodeCallback);
        logger.info(`RESPONSE KIRIM KE-3 SENT CALLBACK TO MERCHANT DEVEL USERNAME => ${username}, MERCHANT => ${merchart} (axiosSendCallbackPayment): ${JSON.stringify(responseCallbackDevel.data)}`);
        await log_response(data.transactionId, req.ip, uid, data.transactionId, `RESPONSE CALLBACK KE-3 DEVEL => ${JSON.stringify(responseCallbackDevel.data)}`);

        //response ke frontend
        return hardCodePayment;
    }
}

module.exports = {

    jwtDecoded: async function(token) {

        const jwtdecoderesp = jwtDecode(token);
        const response = await axios.post(`${process.env.URL_AUTH_REDIRECT}/index.php?dekrip=null`, {
            dekrip: jwtdecoderesp.data
        });

        return response.data;

    },

    getIdOutlet: async function(token) {

        const response = await fetch(`${process.env.URL_HIT}/travel/app/account`, {
            method: 'post',
            body: JSON.stringify({
                token: token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data.data.idOutlet;
    },

    getCountry: function() {
        const data = JSON.parse(fs.readFileSync(__dirname + '/country.json', 'utf8'));
        logger.info(`Country readed!...`)
        return data;
    },

    getInfoClientAll: function(req) {

        const userAgent = req.useragent;
        const ip = req.clientIp;
        return {
            ip: ip,
            browser: {
                name: useragent.browser,
                version: useragent.version,
                platform: userAgent.platform,
                os: userAgent.os,
                source: userAgent.source,
                isMobile: userAgent.isMobile,
                isDesktop: userAgent.isDesktop,
                isBot: userAgent.isBot
            }

        };

    },

    axiosSendCallback: async function(req, method, id_transaksi, type = '') {

        try {

            // if (!req.session['v_session_uid_pin']) {
            // 	return {
            // 		rc: '99',
            // 		rd: 'Youre login via username and password.'
            // 	};
            // }

            //getting data from session
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;
            const pin = uidpin[1] || null;

            const merchart = req.session['v_merchant'];
            const username = req.session['v_uname'];

            //data merchant
            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const urlCallback = parseDataKhususMerchant?.url;
            const send_format = parseDataKhususMerchant?.data1; //format json / text.

            let getResponseGlobal = null;
            if (send_format?.toUpperCase() == 'JSON') {

                logger.info(`REQUEST HIT API RAJABILLER (Production)[JSON] /travel/${type}/callback : ${JSON.stringify({
                    method: method,
                    uid:uid,
                    pin:'----',
                    trxid:id_transaksi
                })}`);

                const url = 'https://rajabiller.fastpay.co.id/transaksi/api_json.php';

                //GETTING DATA CALLBACK FROM RAJABILLER
                getResponseGlobal = await axios.post(url, {
                    method: method,
                    uid: uid,
                    pin: pin,
                    trxid: id_transaksi
                });
                logger.info(`RESPONSE HIT API RAJABILLER (Production)[JSON] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            } else {

                const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;

                logger.info(`REQUEST [${type}][OTOMAX] /travel/${type}/callback: https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`);
                getResponseGlobal = await axios.get(url);

                logger.info(`RESPONSE [${type}][OTOMAX] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            }

            logger.info(`[REQUEST KIRIM KE-1 SENT CALLBACK TO MERCHANT USERNAME => ${username}, MERCHANT => ${merchart}  (axiosSendCallback)] [${type}] URL ${urlCallback} : ${JSON.stringify(getResponseGlobal.data)}`);
            await log_request(id_transaksi, req.ip, uid, id_transaksi, `REQUEST CALLBACK KE-1 USERNAME => ${username}, MERCHANT => ${merchart} => ${JSON.stringify(getResponseGlobal.data)}`);

            const sendCallbackTomerchant = await axios.post(
                urlCallback,
                getResponseGlobal.data || null
            );
            logger.info(`[RESPONSE KIRIM KE-1 SENT CALLBACK TO MERCHANT USERNAME => ${username}, MERCHANT => ${merchart} (axiosSendCallback)] [${type}] URL ${urlCallback}: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            await log_response(id_transaksi, req.ip, uid, id_transaksi, `RESPONSE CALLBACK KE-1 USERNAME => ${username}, MERCHANT => ${merchart} => ${JSON.stringify(sendCallbackTomerchant.data)}`);

            // const response_mitra = sendCallbackTomerchant.data;
            // let parts = response_mitra.split(".") || [];

            // if (parts.length < 3) {
            // 	return {
            // 		rc: "13",
            // 		rd: "Invalid format callback!",
            // 		data: getResponseGlobal.data,
            // 	};
            // }

            // const splitResponse = [
            // 	parts[0],
            // 	parts[1],
            // 	parts.slice(2).join("."),
            // ];

            // if (splitResponse[0] === "ok" && splitResponse[1] === id_transaksi) {

            if (send_format?.toUpperCase() === 'JSON') {
                return {
                    rc: "00",
                    rd: "Success",
                    data: getResponseGlobal.data,
                };
            } else {

                //regex for otomax 
                const regex = /Username:(.*?),Merchant:(.*?),Total komisi:Rp(.*?),Komisi mitra:Rp(.*?),Komisi merchant:Rp(.*?),Saldo terpotong mitra:Rp(.*?),Saldo terpotong merchant:Rp(.*?)$/;
                const match = getResponseGlobal.data.match(regex);

                if (match) {

                    const data = {
                        username: match[1],
                        merchant: match[2],
                        total_komisi: parseInt(match[3], 10),
                        komisi_mitra: parseInt(match[4], 10),
                        komisi_merchant: parseInt(match[5], 10),
                        saldo_terpotong_mitra: parseInt(match[6], 10),
                        saldo_terpotong_merchant: parseInt(match[7], 10)
                    };

                    logger.info(`[REGEX DATA (axiosSendCallback)] id_transaksi => ${id_transaksi} =  ${JSON.stringify(data)}`);

                    return {
                        rc: '00',
                        rd: 'success',
                        data: data
                    }

                } else {
                    return {
                        rc: "13",
                        rd: "Invalid regex otomax!",
                        data: getResponseGlobal.data,
                    };
                }

            }

            // }

            // return {
            // 	rc: "13",
            // 	rd: splitResponse[2],
            // };


        } catch (error) {

            logger.error(`Error [${type}] [FUNCTION] axiosSendCallback: ${error.message}`);
            console.log(error);
            return {
                rc: '68',
                rd: 'Internal Server Error.'
            };

        }

    },

    //NOTE => callback transit belum disesuaikan dengan axios callback diatas nya itu. 
    // axiosSendCallbackKhususKaiTransit: async function(req, method, idtrxList, type = '') {
    //     try {
    //         const uidpin = req.session['v_session_uid_pin'].split('|') || [];
    //         const uid = uidpin[0] || null;
    //         const pin = uidpin[1] || null;

    //         const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
    //         const urlCallback = parseDataKhususMerchant?.url;
    //         const send_format = parseDataKhususMerchant?.data1; //format json / text.

    //         logger.info(`Request /travel/${type}/callback [FUNCTION axiosSendCallbackKhususKaiTransit] [id_transaksi] : ${JSON.stringify(idtrxList)} [MERCHANT IF EXISTS]: ${JSON.stringify(parseDataKhususMerchant || '')} [uid] : ${uid}`);

    //         const promiseArray = idtrxList.map(id_transaksi => {
    //             if (send_format?.toUpperCase() == 'JSON') {
    //                 const url = 'https://rajabiller.fastpay.co.id/transaksi/api_json.php';
    //                 logger.info(`REQUEST TRANSIT [${type}][JSON] /travel/${type}/transit/callback: ${JSON.stringify({
    //                     method: method,
    //                     uid: uid,
    //                     pin: '----', // Note: masking PIN for logging
    //                     trxid: id_transaksi
    //                 })}`);

    //                 //GETTING DATA CALLBACK FROM RAJABILLER
    //                 return axios.post(url, {
    //                     method: method,
    //                     uid: uid,
    //                     pin: pin,
    //                     trxid: id_transaksi
    //                 }).then(response => response.data);

    //             } else {
    //                 const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;
    //                 logger.info(`REQUEST TRANSIT [${type}][OTOMAX] /travel/${type}/transit/callback: ${url}`);

    //                 //GETTING DATA CALLBACK FROM RAJABILLER
    //                 return axios.get(url).then(response => response.data);
    //             }
    //         });

    //         // Wait for all promises to resolve
    //         const getResponseGlobal = await Promise.all(promiseArray);

    //         logger.info(`REQUEST [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(getResponseGlobal)}`);
    //         const sendCallbackTomerchant = await axios.post(urlCallback, getResponseGlobal || null);

    //         if (typeof sendCallbackTomerchant.data === "object") {
    //             logger.info(`RESPONSE [${type}] URL ${urlCallback} [RESPONSE SENT CALLBACK TO MERCHANT]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
    //         } else {
    //             logger.info(`RESPONSE [${type}] URL ${urlCallback} [RESPONSE SENT CALLBACK TO MERCHANT]: ${sendCallbackTomerchant.data}`);
    //         }

    //         return {
    //             rc: '00',
    //             rd: 'success',
    //             callback: sendCallbackTomerchant.data
    //         }
    //     } catch (error) {
    //         logger.error(`Error [${type}] [FUNCTION] axiosSendCallbackKhususKaiTransit: ${error.message}`);
    //         return {
    //             rc: '68',
    //             rd: 'Internal Server Error.'
    //         };
    //     }
    // },

    handlePayment: async function(req, res, type, method, hardcodeCallback, whitelistKey, hardCodePayment) {
        try {
            const data = req.body;

            //for login via username and password
            if (!req.session['v_session_uid_pin']) {
                return {
                    rc: '99',
                    rd: 'Youre login via username and password.'
                };
            }

            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;

            const isProd = await WhitelistDevelByIdOutlet(uid, whitelistKey);
            const response = await processPayment(req, data, uid, isProd, method, type, hardcodeCallback, hardCodePayment);

            return res.send(response);
        } catch (error) {
            logger.error(`Error /${type}/payment: ${error.message}`);
            return res.status(200).send({
                rc: '68',
                rd: 'Internal Server Error.'
            });
        }
    }

};