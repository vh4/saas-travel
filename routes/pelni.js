const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const {
    AuthLogin
} = require('../middleware/auth.js');
const {
    axiosSendCallback,
    handlePayment
} = require('../utils/utils.js');

require('dotenv').config()
const Router = express.Router();
const hardcodepelni = {
    "json":{
        "trxid": "3096161201",
        "rc": "00",
        "status": "Sukses",
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
        "waktu_trx": "2023-11-14 16:19:07",
        "kode_booking": "BLJ6FM",
        "url_etiket": "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=3096161201",
        "url_struk": "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=3096161201",
        "username": "userlogin",
        "merchant": "",
        "total_komisi": "8500",
        "komisi_mitra": "5000",
        "komisi_merchant": "3500",
        "saldo_terpotong_mitra": "274500",
        "saldo_terpotong_merchant": "279500",
        "data_penumpang": [
          {
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
    },
    "text":"Trxid:3096161201,RC:00,Status:Sukses,Produk:CEK SHPPELNI,Data penumpang:nama:TURIKATI SANMAS;tl:1986-04-21;nik:;kabin:5/5072-1#nama:NAZWA HAIRUL NISA;tl:2022-12-25;nik:8102036104860003;kabin:n/a,Nama kapal:KM.TATAMAILAU,Sub class:E,Tgl berangkat:Rabu,22 November 2023 ,Jam berangkat:06:00,Tujuan:TUAL-TIMIKA,Tgl tiba:Kamis,23 November 2023 ,Jam tiba:11:00,Tagihan:Rp263000,Adm:Rp20000,Total bayar:Rp283000,Waktu trx:2023-11-14 15:10:07,Url etiket:,Url struk:,Kode booking:,Username:userlogin,Merchant:"
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

Router.post('/pelni/payment', AuthLogin, async (req, res) => {

    const send_format = JSON.parse(req.session['khusus_merchant'])?.data1;
    await handlePayment(
        req, 
        res, 
        'pelni', 
        'bayarkapal', 
        send_format?.toUpperCase() === 'TEXT' ? hardcodepelni.text : hardcodepelni.json, 
        'SHPPELNI');

});

module.exports = Router;