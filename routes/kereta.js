const express = require('express');
const axios = require('axios'); // Mengganti 'request' dengan 'axios'
const logger = require('../utils/logger.js');
const {
    v4: uuidv4
} = require('uuid');
const {
    AuthLogin
} = require('../middleware/auth.js');
const {
    axiosSendCallback,
    axiosSendCallbackKhususKaiTransit,
    axiosSendCallbackPayment
} = require('../utils/utils.js');
const { WhitelistDevelByIdOutlet } = require('../model/global.js');
const Router = express.Router();
require('dotenv').config()

const hardcodeKereta = {
    "trxid": "3095045080",
    "rc": "77",
    "status": "Transaksi sudah terbayar",
    "produk": "CEK WKAI",
    "kereta": "KUTOJAYA SELATAN (259)",
    "class": "EKO",
    "tgl_berangkat": "2023-11-14",
    "jam": "10:49:00-17:08:00",
    "tujuan": "GOMBONG-KIARACONDONG",
    "tagihan": "124000",
    "adm": "7500",
    "total_bayar": "131500",
    "waktu_trx": "2023-11-14",
    "url_etiket": "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=3095045080",
    "url_struk": "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=3095045080",
    "kode_booking": "WHV6X77",
    "username": "userlogin",
    "merchant": "",
    "total_komisi": "7250",
    "komisi_mitra": "4250",
    "komisi_merchant": "3000",
    "saldo_terpotong_mitra": "124250",
    "saldo_terpotong_merchant": "128500",
    "data_penumpang": [
      {
        "nama": "MUHADI",
        "kursi": "EKO-5/5B",
        "telepon": "089629782291",
        "nomor_identitas": "3305032512990004"
      },
      {
        "nama": "TITI SRI WAHYUNI",
        "kursi": "EKO-5/5C",
        "telepon": "0896297822911",
        "nomor_identitas": "3305044809990005"
      },
      {
        "nama": "EARLYTA ARSYIFA SALSABIL",
        "kursi": "",
        "telepon": "",
        "nomor_identitas": "3305035104230001"
      }
    ]
  }

Router.post('/train/station', async function(req, res) { // Menambahkan async
    try {
        const {
            product,
            token
        } = req.body;

        const response = await axios.post(
            `${process.env.URL_HIT}/train/station`, {
                product,
                token
            }
        );

        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /train/station: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/train/search', async function(req, res) { // Menambahkan async
    try {
        const {
            productCode,
            origin,
            destination,
            date,
            token,
            connection_train
        } = req.body;

        logger.info(`Request /train/search: ${JSON.stringify(req.body)}`);

        const response = await axios.post(
            `${process.env.URL_HIT}/train/search`, {
                productCode,
                origin,
                destination,
                date,
                token,
                connection_train
            }
        );

        logger.info(`Response /train/search: ${response.data.rd} ${response.data.rc}`);
        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /train/search: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//insert data train to session storage.
// Router.post('/train/search/k_search', AuthLogin, async (req, res) => {
//   const data = req.body;

//   if (typeof data == 'object') {
//     logger.info(`INSERT SESSION /train/search/k_search: ${JSON.stringify(data)}`);

//     const uuid = uuidv4();
//     req.session[uuid] = data;

//     return res.send({
//       uuid: uuid,
//       rc: '00',
//       rd: 'success'
//     });

//   } else {
//     return res.send({
//       rc: '03',
//       rd: 'Data yang anda berikan salah.'
//     });
//   }
// });

//retrieve data train from session storage.
// Router.get('/train/search/k_search/:id', AuthLogin, async (req, res) => {
//   const uuid = req.params.id;
//   logger.info(`PARAMS /train/search/k_search/:id: ${uuid}`);

//   const data = req.session[uuid];

//   if (data) {
//     logger.info(`GETTING DATA SESSION /train/search/k_search/:id: ${JSON.stringify(data)}`);
//     return res.send({
//       rc: '00',
//       rd: 'success',
//       ...data
//     });

//   } else {
//     return res.send({
//       rc: '03',
//       rd: 'ID tidak ditemukan.'
//     })
//   }
// });

//insert data hasil booking to session storage.
// Router.post('/train/book/k_book', AuthLogin, async (req, res) => {
// 	const data = req.body;

// 	if (typeof data == 'object') {
// 	  logger.info(`INSERT SESSION /train/book/k_book: ${JSON.stringify(data)}`);

// 	  const uuid = uuidv4();
// 	  req.session[uuid] = data;

// 	  return res.send({
// 		uuid: uuid,
// 		rc: '00',
// 		rd: 'success'
// 	  });

// 	} else {
// 	  return res.send({
// 		rc: '03',
// 		rd: 'Data yang anda berikan salah.'
// 	  });
// 	}
// });

//retrieve data booking from session storage.
// Router.get('/train/book/k_book/:id', AuthLogin, async (req, res) => {
//   const uuid = req.params.id;
//   logger.info(`PARAMS /train/book/k_book/:id: ${uuid}`);

//   const data = req.session[uuid];

//   if (data) {
//     logger.info(`GETTING DATA SESSION /train/book/k_book/:id: ${JSON.stringify(data)}`);
//     return res.send({
//       rc: '00',
//       rd: 'success',
//       ...data
//     });

//   } else {
//     return res.send({
//       rc: '03',
//       rd: 'ID tidak ditemukan.'
//     })
//   }
// });

//update seats data hasil booking :
// Router.put('/train/book/k_book', AuthLogin, async (req, res) => {
// 	const data = req.body;
// 	const uuid = req.body.uuid;

// 	if (typeof data == 'object') {
// 	  logger.info(`PUT SESSION /train/book/k_book: ${JSON.stringify(data)}`);

// 	  req.session[uuid] = data;

// 	  return res.send({
// 		uuid: uuid,
// 		rc: '00',
// 		rd: 'updated'
// 	  });

// 	}else if(uuid == undefined || uuid == ''){

// 		return res.send({
// 			rc: '03',
// 			rd: 'ID tidak ditemukan.'
// 		})

// 	} else {
// 	  return res.send({
// 		rc: '03',
// 		rd: 'Data yang anda berikan salah.'
// 	  });
// 	}
// });


Router.post('/train/get_seat_layout', AuthLogin, async function(req, res) { // Menambahkan async
    try {
        const {
            productCode,
            origin,
            destination,
            date,
            token,
            trainNumber
        } = req.body;

        logger.info(`Request /train/get_seat_layout: ${JSON.stringify(req.body)}`);

        const response = await axios.post(
            `${process.env.URL_HIT}/train/get_seat_layout`, {
                productCode,
                origin,
                destination,
                date,
                token,
                trainNumber
            }
        );

        logger.info(`Response /train/get_seat_layout: ${JSON.stringify(response.data)}`);
        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /train/get_seat_layout: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/train/book', AuthLogin, async function(req, res) { // Menambahkan async
    try {
        const data = req.body;

        data['username'] = req.session['v_uname'];
        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /train/book [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            data['username'] = data['username'] + '#' + merchart;

            if (req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null) {

                const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
                data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

            }
        }

        logger.info(`Request /train/book ${JSON.stringify(data)}`);

        const response = await axios.post(
            `${process.env.URL_HIT}/train/book`, data
        );

        logger.info(`Response /train/book: ${JSON.stringify(response.data)}`);

        if (merchart !== undefined && merchart !== null &&
            merchart !== '' && merchart?.length > 0 &&
            response.data.rc === '00') {

            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const url = parseDataKhususMerchant.url

            logger.info(`Request URL ${url} [CALLBACK]: ${JSON.stringify(response.data.data.callbackData)}`);

            // session['callback_data_booking_khusus_train'] = JSON.stringify(response.data?.data?.callbackData) || null;

            // const sendCallbackTomerchant = await axios.post(
            //   url,
            //   response.data?.data?.callbackData || null // callback data for mitra.
            // );

            // if(typeof sendCallbackTomerchant.data === "object"){
            //   logger.info(`Response URL ${url} [CALLBACK]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            // }else{
            //   logger.info(`Response URL ${url} [CALLBACK]: ${sendCallbackTomerchant.data}`);
            // }

            // //response untuk mitra
            // response.data['callback'] = sendCallbackTomerchant.data;
            // return res.send(response.data);

            response.data['callback'] = JSON.stringify(response.data?.data?.callbackData) || null;
            return res.send(response.data);

        } else {

            //response global.
            response.data['callback'] = null;
            return res.send(response.data);

        }


    } catch (error) {
        logger.error(`Error /train/book: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//callback khusus train.
Router.post('/train/callback', AuthLogin, async function(req, res) { // Menambahkan async

    try {

        const method = 'cekkereta'
        const {
            id_transaksi
        } = req.body;
        const type = 'train';

        const response = await axiosSendCallback(req, method, id_transaksi, type);
        return res.send(response);

    } catch (error) {

        logger.error(`Error /train/callback: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }

});

Router.post('/train/transit/callback', AuthLogin, async function(req, res) { // Menambahkan async

    //kirim callback ke-1
    try {

        const method = 'cekkereta'
        const idtrxList = req.body;
        const type = 'train';

        logger.info(`Request /train/transit/callback: ${idtrxList.id_transaksi}`);
        const response = await axiosSendCallbackKhususKaiTransit(req, method, idtrxList.id_transaksi, type);
        return res.send(response);

    } catch (error) {

        logger.error(`Error /train/callback: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }

});

Router.post('/train/payment', AuthLogin, async function(req, res) { // Menambahkan async
    
    try {
        const data = req.body;        
        //if is_simulate devel => hit to api travel and harcode callback
        const uidpin = req.session['v_session_uid_pin'].split('|') || [];
        const uid = uidpin[0] || null;
        const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
        const urlCallback = parseDataKhususMerchant?.url;
        const requestCallbackSaldoTerpotong = {
            bookingCode:data.bookingCode,
            trxid:data.transactionId,
            nominal:data.nominal,
        }

        //kirim callback ke-2
        logger.info(`Requests /train/payment HIT API CALLBACK (responseCallbackCheckSaldoTerpotong): ${JSON.stringify(requestCallbackSaldoTerpotong)}`);
        const responseCallbackCheckSaldoTerpotong = axios.post(urlCallback, requestCallbackSaldoTerpotong)
        logger.info(`Response /train/payment HIT API CALLBACK (responseCallbackCheckSaldoTerpotong): ${JSON.stringify(response.data)}`);

        const response_mitra = responseCallbackCheckSaldoTerpotong.data;
        if (!response_mitra) {
            return { rc: '01', rd: 'saldo tidak cukup.' };
        }
        const splitResponse = response_mitra.split('.');
        
        if (splitResponse[0] !== 'ok' || splitResponse[1] !== data.transactionId) {
            return { rc: '01', rd: 'saldo tidak cukup.' };
        }

        //check devel or not.
        const isDevel = await WhitelistDevelByIdOutlet(uid, 'WKAI');
        if(isDevel){

            logger.info(`Requests /train/payment HIT API TRAVEL (isDevel): ${JSON.stringify(data)}`);
            const response = await axios.post(
                `${process.env.URL_HIT}/train/payment`, data
            );
    
            logger.info(`Response /train/payment HIT API TRAVEL (isDevel): ${JSON.stringify(response.data)}`);

            //kirim callback payment ke mitra. dengan hardcore.
            const responseCallback = hardcodeKereta;                    
            const responseCallbackDevel = await axios.post(urlCallback, responseCallback);

            logger.info(`Response /train/payment HIT MITRA CALLBACK (responseCallbackDevel isDevel): ${JSON.stringify(responseCallbackDevel)}`);

            //send callback to mitra devel.
            return res.send(response.data);

        }else{

            const method = 'bayarkereta'
            const type = 'plane';
           
            logger.info(`Requests /train/payment HIT API RAJABILLER (isProduction): ${data.transactionId}`);
            const responseCallback = await axiosSendCallbackPayment(req, method, data.transactionId, type);
            logger.info(`Response /train/payment HIT API RAJABILLER (responseCallback isProduction): ${JSON.stringify(responseCallback)}`);
            
            const response = {
                rc: responseCallback.rc,
                rd: responseCallback.status,
                data: responseCallback.data ? {
                    transaction_id: responseCallback.data.trxid,
                    url_etiket: responseCallback.data.url_etiket,
                    url_image: null,
                    url_struk: responseCallback.data.url_struk,
                    komisi:null,
                    komisi_mitra: responseCallback.data.komisi_mitra,
                    komisi_merchant: responseCallback.data.komisi_merchant,
                    total_komisi:responseCallback.data.total_komisi
                } : null
            }

            return res.send(response);
        
        }

    } catch (error) {
        logger.error(`Error /train/payment: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/train/payment-transit', AuthLogin, async function(req, res) { // Menambahkan async
    try {
        const data = req.body;

        logger.info(`Request /train/payment-transit: ${JSON.stringify(data)}`);

        const promiseArray = data.map(d => {

            logger.info(`Request /train/payment-transit/${d.transactionId}: ${JSON.stringify(d)}`);

            return axios.post(
                `${process.env.URL_HIT}/train/payment`, d
            ).then(response => response.data);

        });

        const getResponseGlobal = await Promise.all(promiseArray);

        logger.info(`Response /train/payment-transit: ${JSON.stringify(getResponseGlobal)}`);
        return res.send(getResponseGlobal);

    } catch (error) {
        logger.error(`Error /train/payment-transit: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/train/change_seat', async function(req, res) { // Menambahkan async
    try {
        const data = req.body;

        data['username'] = req.session['v_uname'];

        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /train/change_seat [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            data['username'] = data['username'] + '#' + merchart;

            if (req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null) {

                const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
                data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

            }
        }


        logger.info(`Request /train/change_seat: ${JSON.stringify(data)}`);

        const response = await axios.post(
            `${process.env.URL_HIT}/train/change_seat`, data
        );

        logger.info(`Response /train/change_seat: ${JSON.stringify(response.data)}`);
        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /train/change_seat: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/train/fare', AuthLogin, async function(req, res) { // Menambahkan async
    try {
        const data = req.body;

        logger.info(`Request /train/fare: ${JSON.stringify(data)}`);

        const response = await axios.post(
            `${process.env.URL_HIT}/train/fare`, data
        );

        logger.info(`Response /train/fare: ${JSON.stringify(response.data)}`);
        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /train/fare: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

module.exports = Router;