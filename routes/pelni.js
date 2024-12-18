const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
// const { v4:uuidv4} = require('uuid');
const {
    AuthLogin
} = require('../middleware/auth.js');
const {
    axiosSendCallback,
    axiosSendCallbackPayment
} = require('../utils/utils.js');

require('dotenv').config()
const Router = express.Router();
const hardcodepelni = {
    "trxid": "3096161320",
    "rc": "77",
    "status": "Transaksi sudah terbayar",
    "produk": "BAYAR SHPPELNI",
    "nama_kapal": "KM.TATAMAILAU",
    "sub_class": "E",
    "tgl_berangkat": "Rabu,22 November 2023 ",
    "jam_berangkat": "06:00",
    "tujuan": "TUAL-TIMIKA",
    "tgl_tiba": "Kamis,23 November 2023 ",
    "jam_tiba": "11:00",
    "tagihan": "263000",
    "adm": "20000",
    "total_bayar": "283000",
    "waktu_trx": "2023-11-14 15:59:07",
    "url_etiket": "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=3096161320",
    "url_struk": "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=3096161320",
    "kode_booking": "BLJ6FM",
    "username": "userlogin",
    "merchant": "",
    "total_komisi": "8500",
    "komisi_mitra": "5000",
    "komisi_merchant": "3500",
    "saldo_terpotong_mitra": "274500",
    "saldo_terpotong_merchant": "279500",
    "data_penumpang": [{
            "nama": "TURIKATI SANMAS",
            "tgl_lahir": "1986-04-21",
            "nik": "",
            "kabin": "5/5072-1"
        },
        {
            "nama": "NAZWA HAIRUL NISA",
            "tgl_lahir": "2022-12-25",
            "nik": "8102036104860003",
            "kabin": "n/a"
        }
    ]
}

async function makeAxiosPost(url, data) {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//get get_origin
Router.post('/pelni/get_origin', async (req, res) => {
    const data = req.body;
    try {
        const response = await makeAxiosPost(`${process.env.URL_HIT}/pelni/get_origin`, data);
        return res.send(response);
    } catch (error) {
        logger.error(`Error /pelni/get_origin: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//get check_availability
Router.post('/pelni/check_availability', async (req, res) => {
    const data = req.body;
    logger.info(`Request /pelni/check_availability: ${JSON.stringify(data)}`);
    try {
        const response = await makeAxiosPost(`${process.env.URL_HIT}/pelni/check_availability`, data);
        logger.info(`Response /pelni/check_availability: ${JSON.stringify(response)}`);
        return res.send(response);
    } catch (error) {
        logger.error(`Error /pelni/check_availability: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//pelni fare
Router.post('/pelni/fare', async (req, res) => {
    const data = req.body;
    logger.info(`Request /pelni/fare: ${JSON.stringify(data)}`);
    try {
        const response = await makeAxiosPost(`${process.env.URL_HIT}/pelni/fare`, data);
        logger.info(`Response /pelni/fare: ${JSON.stringify(response)}`);
        return res.send(response);
    } catch (error) {
        logger.error(`Error /pelni/fare: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//pelni search
Router.post('/pelni/search', async (req, res) => {
    const data = req.body;
    logger.info(`Request /pelni/search: ${JSON.stringify(data)}`);
    try {
        const response = await makeAxiosPost(`${process.env.URL_HIT}/pelni/search`, data);
        logger.info(`Response /pelni/search: ${response.data?.rd}`);
        return res.send(response);
    } catch (error) {
        logger.error(`Error /pelni/search: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//get p_search => inserting data detail pelni to session
// Router.post('/pelni/search/p_search', AuthLogin, async (req, res) => {
// 	const data = req.body;

// 	if(typeof data == 'object'){
// 		logger.info(`INSERT SESSION /pelni/search/p_search: ${JSON.stringify(data)}`);

// 		const uuid = uuidv4();
// 		req.session[uuid] = data;

// 		return res.send({
// 			uuid:uuid,
// 			rc:'00',
// 			rd:'success'
// 		})

// 	}else{
// 		return res.send({
// 			rc:'03',
// 			rd:'Data yang anda berikan salah.'
// 		})
// 	}

// });

//get p_search => retrieve data detail pelni to session. for booking information UI.
// Router.get('/pelni/search/p_search/:id', AuthLogin, async (req, res) => {
// 	const uuid = req.params.id;
// 	logger.info(`PARAMS /pelni/search/p_search/:id: ${uuid}`);

// 	const data = req.session[uuid];

// 	if(data){
// 		logger.info(`GETTING DATA SESSION /pelni/search/p_search/:id: ${JSON.stringify(data)}`);
// 		return res.send(data);

// 	}else{
// 		return res.send({
// 			rc:'03',
// 			rd:'ID tidak ditemukan.'
// 		})
// 	}

// });

//insert data booking to session storage.
Router.post('/pelni/book', AuthLogin, async (req, res) => {

    try {

        const data = req.body;

        data['username'] = req.session['v_uname'];
        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /pelni/book [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            data['username'] = data['username'] + '#' + merchart;

            if (req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null) {

                const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
                data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

            }
        }

        logger.info(`Request /pelni/book: ${JSON.stringify(data)}`);

        //booking pelni!
        const response = await makeAxiosPost(`${process.env.URL_HIT}/pelni/book`, data);

        logger.info(`Response /pelni/book: ${JSON.stringify(response)}`);

        //check if merchant data.
        if (merchart !== undefined && merchart !== null &&
            response.rc === '00' && response.data?.callbackData !== undefined && response.data?.callbackData !== null) {

            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const url = parseDataKhususMerchant.url

            logger.info(`Request URL ${url} [CALLBACK]: ${JSON.stringify(response.data?.callbackData)}`);

            // const sendCallbackTomerchant = await axios.post(
            //   url,
            //   response.data?.callbackData || null // callback data for mitra.
            // );

            // if(typeof sendCallbackTomerchant.data === "object"){
            //   logger.info(`Response URL ${url} [CALLBACK]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            // }else{
            //   logger.info(`Response URL ${url} [CALLBACK]: ${sendCallbackTomerchant.data}`);
            // }

            //response untuk mitra
            // response['callback'] = sendCallbackTomerchant.data;

            response.data['callback'] = JSON.stringify(response.data?.data?.callbackData) || null;
            return res.send(response);

        } else {

            //response global.
            response['callback'] = null;
            return res.send(response);

        }

    } catch (error) {
        logger.error(`Timeout Error /pelni/book: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }

});


//callback khusus pelni.
Router.post('/pelni/callback', AuthLogin, async function(req, res) { // Menambahkan async

    try {

        const method = 'cekkapal'
        const {
            id_transaksi
        } = req.body;
        const type = 'pelni';

        const response = await axiosSendCallback(req, method, id_transaksi, type);
        return res.send(response);

    } catch (error) {

        logger.error(`Error /pelni/callback: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }

});

//retrieve data bookign from session storage.
// Router.get('/pelni/book/:id', AuthLogin, (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     logger.info(`Request /pelni/book/:id : ${JSON.stringify(bookingId)}`);

//     if (bookingId == '' || bookingId == undefined) {
//       return res.status(400).send({ rc: '03', rd: 'id transaction is empty.' });
//     }

//     const body = req.session.pelni;
//     logger.info(`Response /pelni/book/:id : ${JSON.stringify(body)}`);

//     if (req.session) {
//       if (req.session.pelni) {
//         if (parseInt(bookingId) === parseInt(body.data.transactionId)) {
//           return res.send(body);
//         }
//       } else {
//         return res.status(400).send({ rc: '03', rd: 'Booking not found.' });
//       }
//     } else {
//       return res.status(400).send({ rc: '03', rd: 'Session expired.' });
//     }
//   } catch (error) {
//     logger.error(`Error: ${JSON.stringify(error.message)}`);
//     return res.status(200).send({ rc: '68', rd: `Internal Server Error.` });
//   }
// });

//insert data book_info to session storage.
Router.post('/pelni/book_info', AuthLogin, async (req, res) => {
    const data = req.body;
    logger.info(`Request /pelni/book_info: ${JSON.stringify(data)}`);
    try {
        const response = await makeAxiosPost(`${process.env.URL_HIT}/pelni/book_info`, data);
        logger.info(`Response /pelni/book_info: ${JSON.stringify(response)}`);

        // if (response.rc == '00') {
        //   logger.info(`INSERT SESSION /pelni/book_info: ${response.rc}`);
        //   // req.session['pelnibookinfo'] = response;
        // }

        return res.send(response);
    } catch (error) {
        logger.error(`Timeout Error /pelni/book_info: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Server Error, Gateway Timeout.'
        });
    }
});

//retrieve data book_info from session storage.
// Router.get('/pelni/book_info/:id', AuthLogin, (req, res) => {
//   try {
//     const bookingInfoId = req.params.id;
//     logger.info(`Request /pelni/book_info/:id : ${bookingInfoId}`);

//     if (bookingInfoId == '' || bookingInfoId == undefined) {
//       return res.status(400).send({ rc: '03', rd: 'id transaction is empty.' });
//     }

//     const body = req.session['pelnibookinfo'];
//     logger.info(`Response /pelni/book_info/:id : ${JSON.stringify(body)}`);

//     if (req.session) {
//       if (body) {
//         try {
//           if (parseInt(bookingInfoId) === parseInt(body.transactionId)) {
//             return res.send(body);
//           } else {
//             return res.status(400).send({ rc: '03', rd: 'Invalid transaction ID.' });
//           }
//         } catch (error) {
//           logger.error(`Error parsing JSON: ${error.message}`);
//           return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
//         }
//       } else {
//         return res.status(400).send({ rc: '03', rd: 'Booking info not found.' });
//       }
//     } else {
//       return res.status(400).send({ rc: '03', rd: 'Session expired.' });
//     }
//   } catch (error) {
//     logger.error(`Error: ${JSON.stringify(error.message)}`);
//     return res.status(200).send({ rc: '68', rd: `Internal Server Error.` });
//   }
// });

//insert data passengers to session storage.
// Router.post('/pelni/booking/passengers', AuthLogin, async (req, res) => {
// 	const data = req.body;

// 	if(typeof data == 'object'){
// 		logger.info(`INSERT SESSION /pelni/booking/passengers: ${JSON.stringify(data)}`);

// 		req.session[data.transactionId] = data;

// 		return res.send({
// 			uuid:data.transactionId,
// 			rc:'00',
// 			rd:'success'
// 		})

// 	}else{
// 		return res.send({
// 			rc:'03',
// 			rd:'Data yang anda berikan salah.'
// 		})
// 	}

// });

//retrieve data passengers from session storage.
// Router.get('/pelni/booking/passengers/:id',AuthLogin, async (req, res) => {
// 	const transactionId = req.params.id;
// 	logger.info(`PARAMS /pelni/booking/passengers/:id: ${transactionId}`);

// 	const data = req.session[transactionId];

// 	if(data){
// 		logger.info(`GETTING DATA SESSION /pelni/booking/passengers/:id: ${JSON.stringify(data)}`);
// 		return res.send({
// 			rc: '00',
// 			rd:'success',
// 			...data
// 		});

// 	}else{
// 		return res.send({
// 			rc:'03',
// 			rd:'ID tidak ditemukan.'
// 		})
// 	}
// });

Router.post('/pelni/payment', AuthLogin, async function(req, res) {
    try {
        const data = req.body;
        //if is_simulate devel => hit to api travel and harcode callback
        const uidpin = req.session['v_session_uid_pin'].split('|') || [];
        const uid = uidpin[0] || null;
        const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
        const urlCallback = parseDataKhususMerchant?.url;
        const requestCallbackSaldoTerpotong = {
            bookingCode: data.bookingCode,
            trxid: data.transactionId,
            nominal: data.nominal,
            nominal_admin: data.nominal_admin
        }

        //kirim callback ke-2
        logger.info(`Requests /pelni/payment HIT API CALLBACK (responseCallbackCheckSaldoTerpotong): ${JSON.stringify(requestCallbackSaldoTerpotong)}`);
        const responseCallbackCheckSaldoTerpotong = await axios.post(urlCallback, requestCallbackSaldoTerpotong)
        logger.info(`Response /pelni/payment HIT API CALLBACK (responseCallbackCheckSaldoTerpotong): ${JSON.stringify(responseCallbackCheckSaldoTerpotong.data)}`);


        const response_mitra = responseCallbackCheckSaldoTerpotong.data;
        if (!response_mitra) {
            return {
                rc: '01',
                rd: 'saldo tidak cukup.'
            };
        }
        const splitResponse = response_mitra.split('.');

        if (splitResponse[0] !== 'ok' || splitResponse[1] !== data.transactionId) {
            return {
                rc: '01',
                rd: 'saldo tidak cukup.'
            };
        }


        //check devel or not.
        const isProd = await WhitelistDevelByIdOutlet(uid, 'SHPPELNI');
        if (isProd) {

            const method = 'bayarkapal'
            const type = 'pelni';

            logger.info(`Requests /pelni/payment HIT API RAJABILLER (isProduction): ${data.transactionId}`);
            const responseCallback = await axiosSendCallbackPayment(req, method, data.transactionId, type);
            logger.info(`Response /pelni/payment HIT API RAJABILLER (responseCallback isProduction): ${JSON.stringify(responseCallback)}`);

            const response = {
                rc: responseCallback.rc,
                rd: responseCallback.status,
                data: responseCallback.data ? {
                    transaction_id: responseCallback.data.trxid,
                    url_etiket: responseCallback.data.url_etiket,
                    url_image: null,
                    url_struk: responseCallback.data.url_struk,
                    nominal: responseCallback.data.tagihan,
                    komisi: null,
                    komisi_mitra: responseCallback.data.komisi_mitra,
                    komisi_merchant: responseCallback.data.komisi_merchant,
                    total_komisi: responseCallback.data.total_komisi
                } : null
            }

            return res.send(response);

        } else {

            logger.info(`Requests /pelni/payment HIT API TRAVEL (isDevel): ${JSON.stringify(data)}`);
            const response = await axios.post(
                `${process.env.URL_HIT}/pelni/payment`, data
            );

            logger.info(`Response /pelni/payment HIT API TRAVEL (isDevel): ${JSON.stringify(response.data)}`);

            //kirim callback payment ke mitra. dengan hardcore.
            const responseCallback = hardcodepelni;
            const responseCallbackDevel = await axios.post(urlCallback, responseCallback);

            logger.info(`Response /pelni/payment HIT MITRA CALLBACK (responseCallbackDevel isDevel): ${JSON.stringify(responseCallbackDevel.data)}`);

            //send callback to mitra devel.
            return res.send(response.data);

        }
    } catch (error) {
        logger.error(`Error /pelni/payment: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

module.exports = Router;