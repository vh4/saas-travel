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
const { WhitelistDevelByIdOutlet } = require('../model/global');

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

            logger.info(`Request /travel/${type}/callback [FUNCTION axiosSendCallback] [id_transaksi] : ${id_transaksi} [MERCHANT IF EXISTS]: ${JSON.stringify(parseDataKhususMerchant || '')} [uid] : ${uid}`);
            let getResponseGlobal = null;

            if (send_format?.toUpperCase() == 'JSON') {

                logger.info(`REQUEST [${type}][JSON] /travel/${type}/callback: ${JSON.stringify({
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
                logger.info(`RESPONSE [${type}][JSON] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            } else {

                const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;
                logger.info(`REQUEST [${type}][OTOMAX] /travel/${type}/callback: https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`);

                //GETTING DATA CALLBACK FROM RAJABILLER
                getResponseGlobal = await axios.get(url);

                logger.info(`RESPONSE [${type}][OTOMAX] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            }

            logger.info(`REQUEST [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(getResponseGlobal.data)}`);
            const sendCallbackTomerchant = await axios.post(
                urlCallback,
                getResponseGlobal.data || null
            );

            if (typeof sendCallbackTomerchant.data === "object") {
                logger.info(`Response [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            } else {
                logger.info(`Response [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${sendCallbackTomerchant.data}`);
            }

            const response_mitra = sendCallbackTomerchant.data;

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


    axiosSendCallbackPayment: async function(req, method, id_transaksi, type = '') {

        try {

            //getting data from session
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;
            const pin = uidpin[1] || null;

            //data merchant
            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const urlCallback = parseDataKhususMerchant?.url;
            const send_format = parseDataKhususMerchant?.data1; //format json / text.

            logger.info(`Request /travel/${type}/callback [FUNCTION axiosSendCallback] [id_transaksi] : ${id_transaksi} [MERCHANT IF EXISTS]: ${JSON.stringify(parseDataKhususMerchant || '')} [uid] : ${uid}`);
            let getResponseGlobal = null;

            if (send_format?.toUpperCase() == 'JSON') {

                logger.info(`REQUEST [${type}][JSON] /travel/${type}/callback: ${JSON.stringify({
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
                logger.info(`RESPONSE [${type}][JSON] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            } else {

                const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;
                logger.info(`REQUEST [${type}][OTOMAX] /travel/${type}/callback: https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`);

                //GETTING DATA CALLBACK FROM RAJABILLER
                getResponseGlobal = await axios.get(url);

                logger.info(`RESPONSE [${type}][OTOMAX] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);

            }

            logger.info(`REQUEST [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(getResponseGlobal.data)}`);
            const sendCallbackTomerchant = await axios.post(
                urlCallback,
                getResponseGlobal.data || null
            );

            if (typeof sendCallbackTomerchant.data === "object") {
                logger.info(`Response [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            } else {
                logger.info(`Response [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${sendCallbackTomerchant.data}`);
            }

            //redturn response dari payment api rb bukan mitra.
            return getResponseGlobal.data;


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


    processCallbackSaldoTerpotong: async function(urlCallback, requestData) {
        logger.info(`Requests HIT API CALLBACK (processCallbackSaldoTerpotong): ${JSON.stringify(requestData)}`);
        const response = await axios.post(urlCallback, requestData);
        logger.info(`Response HIT API CALLBACK (processCallbackSaldoTerpotong): ${JSON.stringify(response.data)}`);
        return response.data;
    },

    processPayment: async function(req, data, uid, isProd, method, type, hardcodeCallback) {
        const urlCallback = JSON.parse(req.session['khusus_merchant'])?.url;

        // Proses callback saldo terpotong
        const requestCallbackSaldoTerpotong = {
            bookingCode: data.bookingCode,
            trxid: data.transactionId,
            nominal: data.nominal,
            nominal_admin: data.nominal_admin
        };
        const responseMitra = await this.processCallbackSaldoTerpotong(urlCallback, requestCallbackSaldoTerpotong);

        if (!responseMitra || responseMitra.split('.')[0] !== 'ok' || responseMitra.split('.')[1] !== data.transactionId) {
            return {
                rc: '01',
                rd: 'Saldo tidak cukup.'
            };
        }

        if (isProd) {
            logger.info(`Requests HIT API RAJABILLER (Production): ${data.transactionId}`);
            const responseCallback = await this.axiosSendCallbackPayment(req, method, data.transactionId, type);
            logger.info(`Response HIT API RAJABILLER (Production): ${JSON.stringify(responseCallback)}`);

            return {
                rc: responseCallback.rc,
                rd: responseCallback.status,
                data: responseCallback.data ? {
                    transaction_id: responseCallback.data.trxid,
                    url_etiket: responseCallback.data.url_etiket,
                    url_struk: responseCallback.data.url_struk,
                    nominal: responseCallback.data.tagihan,
                    komisi_mitra: responseCallback.data.komisi_mitra,
                    komisi_merchant: responseCallback.data.komisi_merchant,
                    total_komisi: responseCallback.data.total_komisi
                } : null
            };
        } else {
            logger.info(`Requests HIT API TRAVEL (Development): ${JSON.stringify(data)}`);
            const response = await axios.post(`${process.env.URL_HIT}/${type}/payment`, data);
            logger.info(`Response HIT API TRAVEL (Development): ${JSON.stringify(response.data)}`);

            // Kirim callback payment dengan hardcode
            await axios.post(urlCallback, hardcodeCallback);

            return response.data;
        }
    },


    handlePayment: async function(req, res, type, method, hardcodeCallback, whitelistKey) {
        try {
            const data = req.body;
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;

            const isProd = await WhitelistDevelByIdOutlet(uid, whitelistKey);
            const response = await this.processPayment(req, data, uid, isProd, method, type, hardcodeCallback);

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