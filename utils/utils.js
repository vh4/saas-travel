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
const { WhitelistDevelByIdOutlet, log_request, log_response } = require('../model/global');

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

            logger.info(`[REQUEST KIRIM KE-3 SENT CALLBACK TO MERCHANT (axiosSendCallbackPayment)] [${type}] URL ${urlCallback} : ${JSON.stringify(getResponseGlobal.data)}`);
            await log_request(id_transaksi, req.ip, uid, id_transaksi, `REQUEST CALLBACK KE-3 => ${JSON.stringify(getResponseGlobal.data)}`);

            const sendCallbackTomerchant = await axios.post(
                urlCallback,
                getResponseGlobal.data || null
            );
            logger.info(`[RESPONSE KIRIM KE-3 SENT CALLBACK TO MERCHANT (axiosSendCallbackPayment)] [${type}] URL ${urlCallback}: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            await log_response(id_transaksi, req.ip, uid, id_transaksi, `RESPONSE CALLBACK KE-3 => ${JSON.stringify(sendCallbackTomerchant.data)}`);

        if(getResponseGlobal.data.rc !== '00'){
            return {
                rc: getResponseGlobal.data.rc,
                rd: getResponseGlobal.data.status
            };
        }

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

async function processCallbackSaldoTerpotong(urlCallback, requestData, uid, ip) {
    logger.info(`REQUEST KIRIM KE-2 SENT CALLBACK TO MERCHANT (processCallbackSaldoTerpotong): ${JSON.stringify(requestData)}`);
    await log_request(requestData.trxid, ip, uid, requestData.trxid, `REQUEST CALLBACK KE-2 => ${JSON.stringify(requestData)}`);

    const response = await axios.post(urlCallback, requestData);
    logger.info(`RESPONSE KIRIM KE-2 SENT CALLBACK TO MERCHANT (processCallbackSaldoTerpotong): ${JSON.stringify(response.data)}`);
    await log_response(requestData.trxid, ip, uid, requestData.trxid, `RESPONSE CALLBACK KE-2 => ${JSON.stringify(response.data)}`);

    return response.data;
}

async function processPayment(req, data, uid, isProd, method, type, hardcodeCallback) {
    const urlCallback = JSON.parse(req.session['khusus_merchant'])?.url;
    // username: callback.username,
    // merchant: callback.merchant,
    // total_komisi: callback.total_komisi,
    // komisi_mitra: callback.komisi_mitra,
    // komisi_merchant: callback.komisi_merchant,
    // saldo_terpotong_mitra: callback.saldo_terpotong_mitra,
    // saldo_terpotong_merchant: callback.saldo_terpotong_merchant,
    // Proses callback saldo terpotong
    const requestCallbackSaldoTerpotong = {
        trxid: data.transactionId,
        saldoterpotongmitra:data.saldo_terpotong_mitra,
        saldoterpotongmerchant: data.saldo_terpotong_merchant,
        username: data.username,
        merchant: data.merchant
    };
    const responseMitra = await processCallbackSaldoTerpotong(urlCallback, requestCallbackSaldoTerpotong, uid, req.ip);

    if (!responseMitra || responseMitra.split('.')[0] !== 'ok' || responseMitra.split('.')[1] !== data.transactionId) {
        return {
            rc: '01',
            rd: 'Saldo tidak cukup.'
        };
    }

    if (isProd) {
        const responseCallback = await axiosSendCallbackPayment(req, method, data.transactionId, type);
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
        logger.info(`Requests HIT API TRAVEL (Development): ${JSON.stringify(data)}`);
        const response = await axios.post(`${process.env.URL_HIT}/${type}/payment`, data);
        logger.info(`Response HIT API TRAVEL (Development): ${JSON.stringify(response.data)}`);

        // Kirim callback payment dengan hardcode
        logger.info(`REQUEST KIRIM KE-3 SENT CALLBACK TO MERCHANT  DEVEL (axiosSendCallbackPayment): ${JSON.stringify(data)}`);
        await log_request(data.trxid, req.ip, uid, data.trxid, `REQUEST CALLBACK KE-3 DEVEL => ${JSON.stringify(data)}`);
        const responseCallbackDevel= await axios.post(urlCallback, hardcodeCallback);
        logger.info(`RESPONSE KIRIM KE-3 SENT CALLBACK TO MERCHANT DEVEL (axiosSendCallbackPayment): ${JSON.stringify(responseCallbackDevel.data)}`);
        await log_response(data.trxid, req.ip, uid, data.trxid, `RESPONSE CALLBACK KE-3 DEVEL => ${JSON.stringify(responseCallbackDevel.data)}`);

        return response.data;
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

            //getting data from session
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;
            const pin = uidpin[1] || null;

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
                //GETTING DATA CALLBACK FROM RAJABILLER
                getResponseGlobal = await axios.get(url);

                logger.info(`RESPONSE [${type}][OTOMAX] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            }

            logger.info(`[REQUEST KIRIM KE-1 SENT CALLBACK TO MERCHANT (axiosSendCallback)] [${type}] URL ${urlCallback} : ${JSON.stringify(getResponseGlobal.data)}`);
            await log_request(id_transaksi, req.ip, uid, id_transaksi, `REQUEST CALLBACK KE-1 => ${JSON.stringify(getResponseGlobal.data)}`);

            const sendCallbackTomerchant = await axios.post(
                urlCallback,
                getResponseGlobal.data || null
            );
            const response_mitra = sendCallbackTomerchant.data;
            logger.info(`[RESPONSE KIRIM KE-1 SENT CALLBACK TO MERCHANT (axiosSendCallback)] [${type}] URL ${urlCallback}: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            await log_response(id_transaksi, req.ip, uid, id_transaksi, `REQUEST CALLBACK KE-1 => ${JSON.stringify(sendCallbackTomerchant.data)}`);

            if (!response_mitra) {
                return {
                    rc: '01',
                    rd: 'saldo tidak cukup.'
                };
            }

            const splitResponse = response_mitra.split('.');

            if (splitResponse.length === 2 && splitResponse[0] === 'ok' && splitResponse[1] === id_transaksi) {
                return {
                    rc: '00',
                    rd: 'success',
                    data: getResponseGlobal.data
                };
            }

            return {
                rc: '01',
                rd: 'saldo tidak cukup.'
            };


        } catch (error) {

            logger.error(`Error [${type}] [FUNCTION] axiosSendCallback: ${error.message}`);
            return {
                rc: '68',
                rd: 'Internal Server Error.'
            };

        }

    },

    axiosSendCallbackKhususKaiTransit: async function(req, method, idtrxList, type = '') {
        try {
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;
            const pin = uidpin[1] || null;

            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const urlCallback = parseDataKhususMerchant?.url;
            const send_format = parseDataKhususMerchant?.data1; //format json / text.

            logger.info(`Request /travel/${type}/callback [FUNCTION axiosSendCallbackKhususKaiTransit] [id_transaksi] : ${JSON.stringify(idtrxList)} [MERCHANT IF EXISTS]: ${JSON.stringify(parseDataKhususMerchant || '')} [uid] : ${uid}`);

            const promiseArray = idtrxList.map(id_transaksi => {
                if (send_format?.toUpperCase() == 'JSON') {
                    const url = 'https://rajabiller.fastpay.co.id/transaksi/api_json.php';
                    logger.info(`REQUEST TRANSIT [${type}][JSON] /travel/${type}/transit/callback: ${JSON.stringify({
                        method: method,
                        uid: uid,
                        pin: '----', // Note: masking PIN for logging
                        trxid: id_transaksi
                    })}`);

                    //GETTING DATA CALLBACK FROM RAJABILLER
                    return axios.post(url, {
                        method: method,
                        uid: uid,
                        pin: pin,
                        trxid: id_transaksi
                    }).then(response => response.data);

                } else {
                    const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;
                    logger.info(`REQUEST TRANSIT [${type}][OTOMAX] /travel/${type}/transit/callback: ${url}`);

                    //GETTING DATA CALLBACK FROM RAJABILLER
                    return axios.get(url).then(response => response.data);
                }
            });

            // Wait for all promises to resolve
            const getResponseGlobal = await Promise.all(promiseArray);

            logger.info(`REQUEST [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(getResponseGlobal)}`);
            const sendCallbackTomerchant = await axios.post(urlCallback, getResponseGlobal || null);

            if (typeof sendCallbackTomerchant.data === "object") {
                logger.info(`RESPONSE [${type}] URL ${urlCallback} [RESPONSE SENT CALLBACK TO MERCHANT]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            } else {
                logger.info(`RESPONSE [${type}] URL ${urlCallback} [RESPONSE SENT CALLBACK TO MERCHANT]: ${sendCallbackTomerchant.data}`);
            }

            return {
                rc: '00',
                rd: 'success',
                callback: sendCallbackTomerchant.data
            }
        } catch (error) {
            logger.error(`Error [${type}] [FUNCTION] axiosSendCallbackKhususKaiTransit: ${error.message}`);
            return {
                rc: '68',
                rd: 'Internal Server Error.'
            };
        }
    },

    handlePayment: async function(req, res, type, method, hardcodeCallback, whitelistKey) {
        try {
            const data = req.body;
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;

            const isProd = await WhitelistDevelByIdOutlet(uid, whitelistKey);
            const response = await processPayment(req, data, uid, isProd, method, type, hardcodeCallback);

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