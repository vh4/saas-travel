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
    return res.status(500).send(error.message);
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

    logger.info(`Response /travel/train/search: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/search: ${error.message}`);
    return res.status(500).send(error.message);
  }
});

//insert data train to session storage.
Router.post('/travel/train/search/k_search', AuthLogin, apiLimiter, async (req, res) => {
  const data = req.body;

  if (typeof data == 'object') {
    logger.info(`INSERT SESSION /travel/train/search/k_search: ${JSON.stringify(data)}`);

    const uuid = uuidv4();
    req.session[uuid] = data;

    return res.send({
      uuid: uuid,
      rc: '00',
      rd: 'success'
    });

  } else {
    return res.send({
      rc: '03',
      rd: 'Data yang anda berikan salah.'
    });
  }
});

//retrieve data train from session storage.
Router.get('/travel/train/search/k_search/:id', AuthLogin, async (req, res) => {
  const uuid = req.params.id;
  logger.info(`PARAMS /travel/train/search/k_search/:id: ${uuid}`);

  const data = req.session[uuid];

  if (data) {
    logger.info(`GETTING DATA SESSION /travel/train/search/k_search/:id: ${JSON.stringify(data)}`);
    return res.send({
      rc: '00',
      rd: 'success',
      ...data
    });

  } else {
    return res.send({
      rc: '03',
      rd: 'ID tidak ditemukan.'
    })
  }
});

//insert data hasil booking to session storage.
Router.post('/travel/train/book/k_book', AuthLogin, apiLimiter, async (req, res) => {
	const data = req.body;
  
	if (typeof data == 'object') {
	  logger.info(`INSERT SESSION /travel/train/book/k_book: ${JSON.stringify(data)}`);
  
	  const uuid = uuidv4();
	  req.session[uuid] = data;
  
	  return res.send({
		uuid: uuid,
		rc: '00',
		rd: 'success'
	  });
  
	} else {
	  return res.send({
		rc: '03',
		rd: 'Data yang anda berikan salah.'
	  });
	}
});

//retrieve data booking from session storage.
Router.get('/travel/train/book/k_book/:id', AuthLogin, async (req, res) => {
  const uuid = req.params.id;
  logger.info(`PARAMS /travel/train/book/k_book/:id: ${uuid}`);

  const data = req.session[uuid];

  if (data) {
    logger.info(`GETTING DATA SESSION /travel/train/book/k_book/:id: ${JSON.stringify(data)}`);
    return res.send({
      rc: '00',
      rd: 'success',
      ...data
    });

  } else {
    return res.send({
      rc: '03',
      rd: 'ID tidak ditemukan.'
    })
  }
});

//update seats data hasil booking :
Router.put('/travel/train/book/k_book', AuthLogin, apiLimiter, async (req, res) => {
	const data = req.body;
	const uuid = req.body.uuid;
  
	if (typeof data == 'object') {
	  logger.info(`PUT SESSION /travel/train/book/k_book: ${JSON.stringify(data)}`);
  
	  req.session[uuid] = data;
  
	  return res.send({
		uuid: uuid,
		rc: '00',
		rd: 'updated'
	  });
  
	}else if(uuid == undefined || uuid == ''){

		return res.send({
			rc: '03',
			rd: 'ID tidak ditemukan.'
		})
		
	} else {
	  return res.send({
		rc: '03',
		rd: 'Data yang anda berikan salah.'
	  });
	}
});


Router.post('/travel/train/get_seat_layout', async function (req, res) { // Menambahkan async
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
    return res.status(500).send(error.message);
  }
});

Router.post('/travel/train/book', apiLimiterKhususBooking, async function (req, res) { // Menambahkan async
  try {
    const data = req.body;

    data['username'] = req.session['v_uname'] || ''

    logger.info(`Request /travel/train/book: ${JSON.stringify(req.body)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/book`,data
    );

    logger.info(`Response /travel/train/book: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/book: ${error.message}`);
    return res.status(500).send(error.message);
  }
});

Router.post('/travel/train/payment', async function (req, res) { // Menambahkan async
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
    return res.status(500).send(error.message);
  }
});

Router.post('/travel/train/change_seat', async function (req, res) { // Menambahkan async
  try {
    const data = req.body;

    logger.info(`Request /travel/train/change_seat: ${JSON.stringify(data)}`);

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/train/change_seat`, data
    );

    logger.info(`Response /travel/train/change_seat: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/train/change_seat: ${error.message}`);
    return res.status(500).send(error.message);
  }
});

Router.post('/travel/train/fare', async function (req, res) { // Menambahkan async
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
    return res.status(500).send(error.message);
  }
});

module.exports = Router;
