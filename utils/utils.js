const fs = require('fs');
const logger = require('./logger');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const useragent = require('express-useragent');
const axios = require('axios')

module.exports = {
    getIdOutlet:async function(token){

        const response = await fetch(`${process.env.URL_HIT}/travel/app/account`, {
            method: 'post',
            body: JSON.stringify({token:token}),
            headers: {'Content-Type': 'application/json'}
        });
    
        const data = await response.json();
        return data.data.idOutlet;
    },

    getCountry: function(){
        const data = JSON.parse(fs.readFileSync(__dirname + '/country.json', 'utf8'));
        logger.info(`Country readed!...`)
        return data;
    },

    getInfoClientAll: function(req){
        
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

    axiosSendCallback: async function(req, method, id_transaksi, type='') {

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
        
            if(send_format?.toUpperCase() == 'JSON'){
        
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
                    uid:uid,
                    pin:pin,
                    trxid:id_transaksi
                });
                logger.info(`RESPONSE [${type}][JSON] /travel/${type}/callback: ${JSON.stringify(getResponseGlobal.data)}`);
            
            }else{
        
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
        
            if(typeof sendCallbackTomerchant.data === "object"){
                logger.info(`Response [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            }else{
                logger.info(`Response [${type}] URL ${urlCallback} [REQUEST SENT CALLBACK TO MERCHANT]: ${sendCallbackTomerchant.data}`);
            }
            
            return {
                rc:'00',
                rd:'success',
                callback:sendCallbackTomerchant.data
            }
                
            } catch (error) {

                logger.error(`Error [${type}] [FUNCTION] axiosSendCallback: ${error.message}`);
                return { 
                    rc: '68', 
                    rd: 'Internal Server Error.' 
                };

            }

    },

    axiosSendCallbackKhususKaiTransit: async function(req, method, idtrxList, type='') {
        try {
            const uidpin = req.session['v_session_uid_pin'].split('|') || [];
            const uid = uidpin[0] || null;
            const pin = uidpin[1] || null;
        
            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const urlCallback = parseDataKhususMerchant?.url;
            const send_format = parseDataKhususMerchant?.data1; //format json / text.
        
            logger.info(`Request /travel/${type}/callback [FUNCTION axiosSendCallbackKhususKaiTransit] [id_transaksi] : ${JSON.stringify(idtrxList)} [MERCHANT IF EXISTS]: ${JSON.stringify(parseDataKhususMerchant || '')} [uid] : ${uid}`);
    
            const promiseArray = idtrxList.map(id_transaksi => {
                if(send_format?.toUpperCase() == 'JSON'){
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
        
            if(typeof sendCallbackTomerchant.data === "object"){
                logger.info(`RESPONSE [${type}] URL ${urlCallback} [RESPONSE SENT CALLBACK TO MERCHANT]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            }else{
                logger.info(`RESPONSE [${type}] URL ${urlCallback} [RESPONSE SENT CALLBACK TO MERCHANT]: ${sendCallbackTomerchant.data}`);
            }
            
            return {
                rc:'00',
                rd:'success',
                callback:sendCallbackTomerchant.data
            }
        } catch (error) {
            logger.error(`Error [${type}] [FUNCTION] axiosSendCallbackKhususKaiTransit: ${error.message}`);
            return { 
                rc: '68', 
                rd: 'Internal Server Error.' 
            };
        }
    }
    

};