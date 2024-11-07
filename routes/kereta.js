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
    axiosSendCallbackKhususKaiTransit
} = require('../utils/utils.js');
const Router = express.Router();
require('dotenv').config()

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

        logger.info(`Request /train/payment: ${JSON.stringify(data)}`);
        const response = await axios.post(
            `${process.env.URL_HIT}/train/payment`, data
        );

        logger.info(`Response /train/payment: ${JSON.stringify(response.data)}`);
        return res.send(response.data);
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