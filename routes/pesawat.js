const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const { v4:uuidv4} = require('uuid');
const { AuthLogin } = require('../middleware/auth.js');
const { axiosSendCallback } = require('../utils/utils.js');
require('dotenv').config()

const Router = express.Router();

Router.post('/flight/search', async function (req, res) {
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
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/flight/airline', async function (req, res) {
  const { product, token } = req.body;
  logger.info(`Request /flight/airline: ${JSON.stringify(req.body)}`);

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/flight/airline`,
      { product, token }
    );

    logger.info(`Response /flight/airline: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /flight/airline: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/flight/airport', async function (req, res) {
  const { product, token } = req.body;

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/flight/airport`,
      { product, token }
    );

    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /flight/airport: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

Router.post('/flight/fare', async function (req, res) {
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
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
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

Router.post('/flight/book', AuthLogin, async function (req, res) {

  try {
  
    const data = req.body;

      data['username'] = req.session['v_uname'];
      const merchart = req.session['v_merchant'];
      const username = req.session['v_uname'];

      logger.info(`Request /flight/book [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);
      
      if(merchart !== undefined && merchart !== null) {
          
        data['username'] =  data['username'] + '#' + merchart;

      if(req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null){

        const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
        data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

        }
      }
  
      logger.info(`Request /flight/book ${JSON.stringify(data)}`);


      const response = await axios.post(
        `${process.env.URL_HIT}/flight/book`,
        data,
        {
          timeout:360000
        }
      );

      logger.info(`Response /flight/book: ${JSON.stringify(response.data)}`);
      
      if(merchart !== undefined && merchart !== null 
        && merchart !== ''  && merchart?.length > 0 
        && response.data.rc === '00') {
    
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
    
        }else{
    
          //response global.
          response.data['callback'] = null;
          return res.send(response.data);
        
        }
      

  } catch (error) {
    logger.error(`Error /flight/book: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }

});

//callback khusus plane.
Router.post('/plane/callback', AuthLogin, async function (req, res) { // Menambahkan async
  
  try {

    const method = 'cekpesawat'
    const { id_transaksi } = req.body;
    const type = 'plane';
    
    const response = await axiosSendCallback(req, method, id_transaksi, type);
    return res.send(response);

  } catch (error) {
    
    logger.error(`Error /plane/callback: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

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


Router.post('/flight/payment', AuthLogin, async function (req, res) {
  const data = req.body;
  logger.info(`Request /flight/payment: ${JSON.stringify(data)}`);

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/flight/payment`,
      data
    );

    logger.info(`Response /flight/payment: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /flight/payment: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

module.exports = Router;
