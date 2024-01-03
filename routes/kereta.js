const express = require('express');
const axios = require('axios'); // Mengganti 'request' dengan 'axios'
const logger = require('../utils/logger.js');
const { v4: uuidv4 } = require('uuid');
const { AuthLogin } = require('../middleware/auth.js');
const { apiLimiter, apiLimiterKhususBooking } = require('../middleware/limit.js');
const Router = express.Router();
require('dotenv').config()

Router.post('/travel/train/station', async function (req, res) { // Menambahkan async
  try {
    const { product, token } = req.body;

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/station`,
      {
        product,
        token
      }
    );

    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/station: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/travel/train/search', async function (req, res) { // Menambahkan async
  try {
    const { productCode, origin, destination, date, token } = req.body;

    logger.info(`Request /travel/train/search: ${JSON.stringify(req.body)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/search`,
      {
        productCode,
        origin,
        destination,
        date,
        token
      }
    );

    logger.info(`Response /travel/train/search: ${response.data.rd}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/search: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

//insert data train to session storage.
// Router.post('/travel/train/search/k_search', AuthLogin, apiLimiter, async (req, res) => {
//   const data = req.body;

//   if (typeof data == 'object') {
//     logger.info(`INSERT SESSION /travel/train/search/k_search: ${JSON.stringify(data)}`);

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
// Router.get('/travel/train/search/k_search/:id', AuthLogin, async (req, res) => {
//   const uuid = req.params.id;
//   logger.info(`PARAMS /travel/train/search/k_search/:id: ${uuid}`);

//   const data = req.session[uuid];

//   if (data) {
//     logger.info(`GETTING DATA SESSION /travel/train/search/k_search/:id: ${JSON.stringify(data)}`);
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
// Router.post('/travel/train/book/k_book', AuthLogin, apiLimiter, async (req, res) => {
// 	const data = req.body;
  
// 	if (typeof data == 'object') {
// 	  logger.info(`INSERT SESSION /travel/train/book/k_book: ${JSON.stringify(data)}`);
  
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
// Router.get('/travel/train/book/k_book/:id', AuthLogin, async (req, res) => {
//   const uuid = req.params.id;
//   logger.info(`PARAMS /travel/train/book/k_book/:id: ${uuid}`);

//   const data = req.session[uuid];

//   if (data) {
//     logger.info(`GETTING DATA SESSION /travel/train/book/k_book/:id: ${JSON.stringify(data)}`);
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
// Router.put('/travel/train/book/k_book', AuthLogin, apiLimiter, async (req, res) => {
// 	const data = req.body;
// 	const uuid = req.body.uuid;
  
// 	if (typeof data == 'object') {
// 	  logger.info(`PUT SESSION /travel/train/book/k_book: ${JSON.stringify(data)}`);
  
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


Router.post('/travel/train/get_seat_layout', AuthLogin, async function (req, res) { // Menambahkan async
  try {
    const { productCode, origin, destination, date, token, trainNumber } = req.body;

    logger.info(`Request /travel/train/get_seat_layout: ${JSON.stringify(req.body)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/get_seat_layout`,
      {
        productCode,
        origin,
        destination,
        date,
        token,
        trainNumber
      }
    );

    logger.info(`Response /travel/train/get_seat_layout: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/get_seat_layout: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/travel/train/book', AuthLogin, apiLimiterKhususBooking, async function (req, res) { // Menambahkan async
  try {
    const data = req.body;

    data['username'] = req.session['v_uname'];
    const merchart = req.session['v_merchant'];
    const username = req.session['v_uname'];

    logger.info(`Request /travel/train/book [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

    if(merchart !== undefined && merchart !== null) {
      
        data['username'] =  data['username'] + '#' + merchart;

      if(req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null){

        const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
        data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

      }
    }

    logger.info(`Request /travel/train/book ${JSON.stringify(data)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/book`,data
    );

    logger.info(`Response /travel/train/book: ${JSON.stringify(response.data)}`);

    if(merchart !== undefined && merchart !== null 
    && merchart !== ''  && merchart?.length > 0 
    && response.data.rc === '00') {

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

    }else{

      //response global.
      response.data['callback'] = null;
      return res.send(response.data);
    
    }


  } catch (error) {
    logger.error(`Error /travel/train/book: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

//callback khusus train.
Router.post('/travel/train/callback', AuthLogin, apiLimiterKhususBooking, async function (req, res) { // Menambahkan async
  
  try {

    const uidpin = req.session['v_session_uid_pin'].split('|') || [];
    const uid = uidpin[0] || null;
    const pin = uidpin[1] || null;
    const method = 'cekkereta'
    const { id_transaksi } = req.body;

    //data merchant
    const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
    const urlCallback = parseDataKhususMerchant?.url;
    const send_format = parseDataKhususMerchant?.data1; //format json / text.

    logger.info(`Request /travel/train/callback [id_transaksi] : ${id_transaksi} [MERCHANT IF EXISTS]: ${JSON.stringify(parseDataKhususMerchant || '')} [uid] : ${uid}`);

    let getResponseGlobal = null;

    if(send_format?.toUpperCase() == 'JSON'){

      logger.info(`REQUEST https://rajabiller.fastpay.co.id/transaksi/api_json.php [JSON]: ${JSON.stringify({
        method: method,
        uid:uid,
        pin:pin,
        trxid:id_transaksi
      })}`);

      const url = 'https://rajabiller.fastpay.co.id/transaksi/api_json.php';
      getResponseGlobal = await axios.get(url, {
        method: method,
        uid:uid,
        pin:pin,
        trxid:id_transaksi
      });

      logger.info(`Response /travel/train/callback : ${JSON.stringify(getResponseGlobal.data)}`);

    }else{

      const url = `https://rajabiller.fastpay.co.id/transaksi/api_otomax.php?method=${method}&uid=${uid}&pin=${pin}&trxid=${id_transaksi}`;
      
      logger.info(`REQUEST https://rajabiller.fastpay.co.id/transaksi/api_json.php [OTOMAX]: ${url}`);

      getResponseGlobal = await axios.get(url);

      logger.info(`Response /travel/train/callback : ${JSON.stringify(getResponseGlobal.data)}`);

    }

      logger.info(`REQUEST URL ${urlCallback} [sendCallbackTomerchant]: ${JSON.stringify(getResponseGlobal.data)}`);
     
      const sendCallbackTomerchant = await axios.post(
        urlCallback,
        getResponseGlobal.data || null
      );

      if(typeof sendCallbackTomerchant.data === "object"){
        logger.info(`Response URL ${urlCallback} [CALLBACK]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
      }else{
        logger.info(`Response URL ${urlCallback} [CALLBACK]: ${sendCallbackTomerchant.data}`);
      }

      const response = {
        rc:'00',
        rd:'success',
        callback:sendCallbackTomerchant.data
      }
      return res.send(response);


  } catch (error) {
    
    logger.error(`Error /travel/train/callback: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }


})

Router.post('/travel/train/payment', AuthLogin, async function (req, res) { // Menambahkan async
  try {
    const data = req.body;

    logger.info(`Request /travel/train/payment: ${JSON.stringify(data)}`);
    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/payment`,data
    );

    logger.info(`Response /travel/train/payment: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/payment: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/travel/train/change_seat', async function (req, res) { // Menambahkan async
  try {
    const data = req.body;

    data['username'] = req.session['v_uname'];

    const merchart = req.session['v_merchant'];
    const username = req.session['v_uname'];

    logger.info(`Request /travel/train/change_seat [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

    if(merchart !== undefined && merchart !== null) {
      
        data['username'] =  data['username'] + '#' + merchart;

      if(req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null){

        const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
        data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

      }
    }


    logger.info(`Request /travel/train/change_seat: ${JSON.stringify(data)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/change_seat`, data
    );

    logger.info(`Response /travel/train/change_seat: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/change_seat: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/travel/train/fare', AuthLogin, async function (req, res) { // Menambahkan async
  try {
    const data = req.body;

    logger.info(`Request /travel/train/fare: ${JSON.stringify(data)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/fare`,data
    );

    logger.info(`Response /travel/train/fare: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/fare: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

module.exports = Router;
