const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const {
    v4: uuidv4
} = require('uuid');
const {
    AuthLogin
} = require('../middleware/auth.js');
const {
    axiosSendCallback,
    axiosSendCallbackPayment
} = require('../utils/utils.js');
require('dotenv').config()
const hardcodePesawat = {
    "trxid": "199512506",
    "rc": "00",
    "status": "Sukses",
    "produk": "BAYAR TPJT",
    "maskapai": "Super Air Jet",
    "kode_maskapai": "IU659",
    "sub_class": "Y",
    "tgl_berangkat": "Rabu, 15 November 2023",
    "jam_berangkat": "13:30",
    "tgl_tiba": "Rabu, 15 November 2023",
    "jam_tiba": "14:25",
    "durasi": "0 jam 55 menit",
    "tujuan": "Samarinda (AAP)-Yogyakarta (YIA)",
    "tagihan": "3169000",
    "adm": "0",
    "total_bayar": "3169000",
    "waktu_trx": "2023-11-14 11:48:53",
    "url_etiket": "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=199512506",
    "url_struk": "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=199512506",
    "kode_booking": "ABOWSD",
    "username": "userlogin",
    "merchant": "",
    "total_komisi": "19000",
    "komisi_mitra": "9500",
    "komisi_merchant": "9500",
    "saldo_terpotong_mitra": "3169000",
    "saldo_terpotong_merchant": "3169000",
    "data_penumpang": [{
            "status": "DEWASA",
            "nama": "AGUS SURATNO SURATNO",
            "title": "MR",
            "nik": "3402161903710002",
            "tgl_lahir": "03/19/1971",
            "no_hp": "081392891155"
        },
        {
            "status": "DEWASA",
            "nama": "KASIDI KASIDI",
            "title": "MR",
            "nik": "3402102707780002",
            "tgl_lahir": "07/27/1978",
            "no_hp": ""
        }
    ]
}

const Router = express.Router();

Router.post('/flight/search', async function(req, res) {
    const data = req.body;
    logger.info(`Request /flight/search: ${JSON.stringify(data)}`);

    try {
        const response = await axios.post(
            `${process.env.URL_HIT}/flight/search`,
            data
        );

        logger.info(`Response /flight/search: ${response.data.rd}`);
        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /flight/search: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/flight/airline', async function(req, res) {
    const {
        product,
        token
    } = req.body;
    logger.info(`Request /flight/airline: ${JSON.stringify(req.body)}`);

    try {
        const response = await axios.post(
            `${process.env.URL_HIT}/flight/airline`, {
                product,
                token
            }
        );

        logger.info(`Response /flight/airline: ${JSON.stringify(response.data)}`);
        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /flight/airline: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/flight/airport', async function(req, res) {
    const {
        product,
        token
    } = req.body;

    try {
        const response = await axios.post(
            `${process.env.URL_HIT}/flight/airport`, {
                product,
                token
            }
        );

        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /flight/airport: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/flight/fare', async function(req, res) {
    const data = req.body;
    logger.info(`Request /flight/fare: ${JSON.stringify(data)}`);

    try {
        const response = await axios.post(
            `${process.env.URL_HIT}/flight/fare`,
            data
        );

        logger.info(`Response /flight/fare: ${JSON.stringify(response.data)}`);
        res.send(response.data);
    } catch (error) {
        logger.error(`Error /flight/fare: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//insert data search to session storage.
// Router.post('/pesawat/search/flight', AuthLogin, async (req, res) => {
// 	const data = req.body;

// 	if(typeof data == 'object'){
// 		logger.info(`INSERT SESSION /pesawat/search/_flight: ${JSON.stringify(data)}`);

//     const uuid = uuidv4();
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


//select data search for booking to session storage.
// Router.get('/pesawat/search/flight/:id', AuthLogin, async (req, res) => {
//   const uuid = req.params.id;
//   logger.info(`PARAMS /pesawat/search/flight/:id: ${uuid}`);

//   const data = req.session[uuid];

//   if (data) {
//     logger.info(`GETTING DATA SESSION /pesawat/search/flight/:id: ${JSON.stringify(data)}`);
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

Router.post('/flight/book', AuthLogin, async function(req, res) {

    try {

        const data = req.body;

        data['username'] = req.session['v_uname'];
        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /flight/book [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            data['username'] = data['username'] + '#' + merchart;

            if (req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null) {

                const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
                data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

            }
        }

        logger.info(`Request /flight/book ${JSON.stringify(data)}`);


        const response = await axios.post(
            `${process.env.URL_HIT}/flight/book`,
            data, {
                timeout: 3360000
            }
        );

        logger.info(`Response /flight/book: ${JSON.stringify(response.data)}`);

        if (merchart !== undefined && merchart !== null &&
            merchart !== '' && merchart?.length > 0 &&
            response.data.rc === '00') {

            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const url = parseDataKhususMerchant.url

            logger.info(`Request URL ${url} [CALLBACK]: ${JSON.stringify(response.data?.data?.callbackData)}`);

            // const sendCallbackTomerchant = await axios.post(
            //   url,
            //   response.data?.data?.callbackData || null // callback data for mitra.
            // );

            // if(typeof sendCallbackTomerchant.data === "object"){
            //   logger.info(`Response URL ${url} [CALLBACK]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            // }else{
            //   logger.info(`Response URL ${url} [CALLBACK]: ${sendCallbackTomerchant.data}`);
            // }

            //response untuk mitra
            // response.data['callback'] = sendCallbackTomerchant.data;

            response.data['callback'] = JSON.stringify(response.data?.data?.callbackData) || null;
            return res.send(response.data);

        } else {

            //response global.
            response.data['callback'] = null;
            return res.send(response.data);

        }


    } catch (error) {
        logger.error(`Error /flight/book: ${error.message}`);

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            // Axios timeout
            return res.status(504).send({
                rc: '504',
                rd: 'Gateway Timeout'
            });
        } else if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return res.status(error.response.status).send({
                rc: error.response.status.toString(),
                rd: error.response.statusText,
            });
        } else {
            // Other errors
            return res.status(500).send({
                rc: '500',
                rd: 'Internal Server Error'
            });
        }
    }

});

//callback khusus plane.
Router.post('/plane/callback', AuthLogin, async function(req, res) { // Menambahkan async

    try {

        const method = 'cekpesawat'
        const {
            id_transaksi
        } = req.body;
        const type = 'plane';

        const response = await axiosSendCallback(req, method, id_transaksi, type);
        return res.send(response);

    } catch (error) {

        logger.error(`Error /plane/callback: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }

});

//insert data book to session storage.
// Router.post('/pesawat/book/flight', AuthLogin, async (req, res) => {
// 	const data = req.body;

// 	if(typeof data == 'object'){
// 		logger.info(`INSERT SESSION /pesawat/book/flight: ${JSON.stringify(data)}`);

//     const uuid = uuidv4();
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

//select data booking for booking to session storage.
// Router.get('/pesawat/book/flight/:id', AuthLogin, async (req, res) => {
//   const uuid = req.params.id;
//   logger.info(`PARAMS /pesawat/book/flight/:id: ${uuid}`);

//   const data = req.session[uuid];

//   if (data) {
//     logger.info(`GETTING DATA SESSION /pesawat/book/flight/:id: ${JSON.stringify(data)}`);
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


Router.post('/flight/payment', AuthLogin, async function(req, res) {

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
        logger.info(`Requests /flight/payment HIT API CALLBACK (responseCallbackCheckSaldoTerpotong): ${JSON.stringify(requestCallbackSaldoTerpotong)}`);
        const responseCallbackCheckSaldoTerpotong = await axios.post(urlCallback, requestCallbackSaldoTerpotong)
        logger.info(`Response /flight/payment HIT API CALLBACK (responseCallbackCheckSaldoTerpotong): ${JSON.stringify(responseCallbackCheckSaldoTerpotong.data)}`);


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
        const isProd = await WhitelistDevelByIdOutlet(uid, 'PESAWAT');
        if (isProd) {

            const method = 'bayarpesawat'
            const type = 'plane';

            logger.info(`Requests /flight/payment HIT API RAJABILLER (isProduction): ${data.transactionId}`);
            const responseCallback = await axiosSendCallbackPayment(req, method, data.transactionId, type);
            logger.info(`Response /flight/payment HIT API RAJABILLER (responseCallback isProduction): ${JSON.stringify(responseCallback)}`);

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

            logger.info(`Requests /flight/payment HIT API TRAVEL (isDevel): ${JSON.stringify(data)}`);
            const response = await axios.post(
                `${process.env.URL_HIT}/flight/payment`, data
            );

            logger.info(`Response /flight/payment HIT API TRAVEL (isDevel): ${JSON.stringify(response.data)}`);

            //kirim callback payment ke mitra. dengan hardcore.
            const responseCallback = hardcodePesawat;
            const responseCallbackDevel = await axios.post(urlCallback, responseCallback);

            logger.info(`Response /flight/payment HIT MITRA CALLBACK (responseCallbackDevel isDevel): ${JSON.stringify(responseCallbackDevel.data)}`);

            //send callback to mitra devel.
            return res.send(response.data);

        }


    } catch (error) {
        logger.error(`Error /flight/payment: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

module.exports = Router;