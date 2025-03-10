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
    // axiosSendCallbackKhususKaiTransit,
    handlePayment
} = require('../utils/utils.js');
const Router = express.Router();
require('dotenv').config()

const hardcodeKereta = {
    "json":{
        "trxid": "3095045099",
        "rc": "00",
        "status": "Sukses",
        "produk": "BAYAR WKAI",
        "kereta": "KUTOJAYA SELATAN (259)",
        "class": "EKO",
        "tgl_berangkat": "2023-11-14",
        "jam": "10:49:00-17:08:00",
        "tujuan": "GOMBONG-KIARACONDONG",
        "tagihan": "124000",
        "adm": "7500",
        "total_bayar": "131500",
        "waktu_trx": "2023-11-14",
        "url_etiket": "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=3095045099",
        "url_struk": "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=3095045099",
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
            "kursi": "EKO-3/17B",
            "telepon": "089629782291",
            "nomor_identitas": "3305032512990004"
          },
          {
            "nama": "TITI SRI WAHYUNI",
            "kursi": "EKO-3/17C",
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
    },

    "text": "Trxid:3095045111,RC:00,Status:Sukses,Produk:BAYAR WKAI,Data penumpang:nama:MUHADI,kursi:EKO-3/17B#nama:TITI SRI WAHYUNI,kursi:EKO-3/17C#nama:EARLYTA ARSYIFA SALSABIL,kursi:n/a,Kereta:KUTOJAYA SELATAN (259),Class:EKO,Tgl berangkat:2023-11-11,Jam:10:49:00-17:08:00,Tujuan:GOMBONG-KIARACONDONG,Tagihan:Rp124000,Adm:Rp7500,Total bayar:Rp131500,Waktu trx:2023-11-14,Url etiket:https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=3095045111,Url struk:https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=3095045111,Kode booking:WHV6X77,Username:userlogin,Merchant:",
}

const hardCodePayment = {
    "data": {
      "transaction_id": "3095045099",
      "url_etiket": "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=3095045099",
      "url_image": "https://rajabiller.fastpay.co.id/travel/app/generate_image_etiket?id_transaksi=3095045099",
      "url_struk": "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=3095045099",
      "komisi": null
    },
    "rc": "00",
    "rd": "Simulate Succes",
    "mid": "4226666215",
    "invoking": "Payment Train",
    "processingTime": "0.038840055465698 Second"
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
            id_transaksi,
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

// Router.post('/train/transit/callback', AuthLogin, async function(req, res) { // Menambahkan async

//     //kirim callback ke-1
//     try {

//         const method = 'cekkereta'
//         const idtrxList = req.body;
//         const type = 'train';

//         logger.info(`Request /train/transit/callback: ${idtrxList.id_transaksi}`);
//         const response = await axiosSendCallbackKhususKaiTransit(req, method, idtrxList.id_transaksi, type);
//         return res.send(response);

//     } catch (error) {

//         logger.error(`Error /train/callback: ${error.message}`);
//         return res.status(200).send({
//             rc: '68',
//             rd: 'Internal Server Error.'
//         });

//     }

// });

// Router.post('/train/payment-transit', AuthLogin, async function(req, res) { // Menambahkan async
//     try {
//         const data = req.body;

//         logger.info(`Request /train/payment-transit: ${JSON.stringify(data)}`);

//         const promiseArray = data.map(d => {

//             logger.info(`Request /train/payment-transit/${d.transactionId}: ${JSON.stringify(d)}`);

//             return axios.post(
//                 `${process.env.URL_HIT}/train/payment`, d
//             ).then(response => response.data);

//         });

//         const getResponseGlobal = await Promise.all(promiseArray);

//         logger.info(`Response /train/payment-transit: ${JSON.stringify(getResponseGlobal)}`);
//         return res.send(getResponseGlobal);

//     } catch (error) {
//         logger.error(`Error /train/payment-transit: ${error.message}`);
//         return res.status(200).send({
//             rc: '68',
//             rd: 'Internal Server Error.'
//         });
//     }
// });

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

Router.post('/train/payment', AuthLogin, async (req, res) => {

    const send_format = JSON.parse(req.session['khusus_merchant'])?.data1;

    const merchart = req.session['v_merchant'];
    const username = req.session['v_uname'];

    logger.info(`Request /train/payment [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}, data: ${JSON.stringify(req.body)}`);

    await handlePayment(
        req, 
        res, 
        'train', 
        'bayarkereta',
        send_format?.toUpperCase() === 'TEXT' ? hardcodeKereta.text : hardcodeKereta.json, 
        'WKAIH',
        hardCodePayment
        );
});

module.exports = Router;