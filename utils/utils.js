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
        
                logger.info(`REQUEST [${type}] https://rajabiller.fastpay.co.id/transaksi/api_json.php [JSON]: ${JSON.stringify({
                    method: method,
                    uid:uid,
                    pin:pin,
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
                logger.info(`RESPONSE [${type}] /travel/train/callback : ${JSON.stringify(getResponseGlobal.data)}`);
            
            }else{
        
                const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;       
                logger.info(`REQUEST [${type}] https://rajabiller.fastpay.co.id/transaksi/api_json.php [OTOMAX]: ${url}`);  
                
                //GETTING DATA CALLBACK FROM RAJABILLER
                getResponseGlobal = await axios.get(url);
                
                logger.info(`RESPONSE [${type}] /travel/train/callback : ${JSON.stringify(getResponseGlobal.data)}`);
            
            }
        
            logger.info(`REQUEST [${type}] URL ${urlCallback} [sendCallbackTomerchant]: ${JSON.stringify(getResponseGlobal.data)}`);
            const sendCallbackTomerchant = await axios.post(
                urlCallback,
                getResponseGlobal.data || null
            );
        
            if(typeof sendCallbackTomerchant.data === "object"){
                logger.info(`Response [${type}] URL ${urlCallback} [CALLBACK]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            }else{
                logger.info(`Response [${type}] URL ${urlCallback} [CALLBACK]: ${sendCallbackTomerchant.data}`);
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

    }

};