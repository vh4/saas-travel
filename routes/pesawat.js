const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const { v4:uuidv4} = require('uuid');
const { AuthLogin } = require('../middleware/auth.js');
const { apiLimiter, apiLimiterKhususBooking } = require('../middleware/limit.js');
require('dotenv').config()

const Router = express.Router();

Router.post('/travel/flight/search', async function (req, res) {
  const data = req.body;
  logger.info(`Request /travel/flight/search: ${JSON.stringify(data)}`);

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/travel/flight/search`,
      data
    );

    logger.info(`Response /travel/flight/search: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/flight/search: ${error.message}`);
    return res.send({ rc:'68', rd: 'Internal Server Error' });
  }
});

Router.post('/travel/flight/airline', async function (req, res) {
  const { product, token } = req.body;
  logger.info(`Request /travel/flight/airline: ${JSON.stringify(req.body)}`);

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/travel/flight/airline`,
      { product, token }
    );

    logger.info(`Response /travel/flight/airline: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/flight/airline: ${error.message}`);
    return res.send({ rc:'68', rd: 'Internal Server Error' });
  }
});

Router.post('/travel/flight/airport', async function (req, res) {
  const { product, token } = req.body;

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/travel/flight/airport`,
      { product, token }
    );

    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/flight/airport: ${error.message}`);
    return res.send({ rc:'68', rd: 'Internal Server Error' });
  }
});

Router.post('/travel/flight/fare', async function (req, res) {
  const data = req.body;
  logger.info(`Request /travel/flight/fare: ${JSON.stringify(data)}`);

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/travel/flight/fare`,
      data
    );

    logger.info(`Response /travel/flight/fare: ${JSON.stringify(response.data)}`);
    res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/flight/fare: ${error.message}`);
    return res.send({ rc:'68', rd: 'Internal Server Error' });
  }
});

//insert data search to session storage.
Router.post('/travel/pesawat/search/flight', AuthLogin, apiLimiter, async (req, res) => {
	const data = req.body;
	
	if(typeof data == 'object'){
		logger.info(`INSERT SESSION /travel/pesawat/search/_flight: ${JSON.stringify(data)}`);

    const uuid = uuidv4();
		req.session[uuid] = data;

		return res.send({
			uuid:uuid,
			rc:'00',
			rd:'success'
		})

	}else{
		return res.send({
			rc:'03',
			rd:'Data yang anda berikan salah.'
		})
	}

});


//select data search for booking to session storage.
Router.get('/travel/pesawat/search/flight/:id', AuthLogin, async (req, res) => {
  const uuid = req.params.id;
  logger.info(`PARAMS /travel/pesawat/search/flight/:id: ${uuid}`);

  const data = req.session[uuid];

  if (data) {
    logger.info(`GETTING DATA SESSION /travel/pesawat/search/flight/:id: ${JSON.stringify(data)}`);
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

Router.post('/travel/flight/book', apiLimiterKhususBooking, async function (req, res) {
  const data = req.body;
  data['username'] = req.session['v_uname'] || ''
  const merchart = req.session['v_merchant'] || ''

  if(merchart !== undefined && merchart !== null && merchart !== ''  && merchart?.length > 0) {
    data['username'] =  data['username'] + '#' + merchart
  }
  
  logger.info(`Request /travel/flight/book: ${JSON.stringify(data)}`);
  try {

    const response = await axios.post(
      `${process.env.URL_HIT}/travel/flight/book`,
      data
    );

    logger.info(`Response /travel/flight/book: ${JSON.stringify(response.data)}`);
    return res.send(response.data);

  } catch (error) {
    logger.error(`Error /travel/flight/book: ${error.message}`);
    return res.send({ rc:'68', rd: 'Internal Server Error' });
  }
});

//insert data book to session storage.
Router.post('/travel/pesawat/book/flight', AuthLogin, apiLimiter, async (req, res) => {
	const data = req.body;
	
	if(typeof data == 'object'){
		logger.info(`INSERT SESSION /travel/pesawat/book/flight: ${JSON.stringify(data)}`);

    const uuid = uuidv4();
		req.session[uuid] = data;

		return res.send({
			uuid:uuid,
			rc:'00',
			rd:'success'
		})

	}else{
		return res.send({
			rc:'03',
			rd:'Data yang anda berikan salah.'
		})
	}

});

//select data booking for booking to session storage.
Router.get('/travel/pesawat/book/flight/:id', AuthLogin, async (req, res) => {
  const uuid = req.params.id;
  logger.info(`PARAMS /travel/pesawat/book/flight/:id: ${uuid}`);

  const data = req.session[uuid];

  if (data) {
    logger.info(`GETTING DATA SESSION /travel/pesawat/book/flight/:id: ${JSON.stringify(data)}`);
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


Router.post('/travel/flight/payment', async function (req, res) {
  const data = req.body;
  logger.info(`Request /travel/flight/payment: ${JSON.stringify(data)}`);

  try {
    const response = await axios.post(
      `${process.env.URL_HIT}/travel/flight/payment`,
      data
    );

    logger.info(`Response /travel/flight/payment: ${JSON.stringify(response.data)}`);
    return res.send(response.data);
  } catch (error) {
    logger.error(`Error /travel/flight/payment: ${error.message}`);
    return res.send({ error: 'Internal Server Error' });
  }
});

module.exports = Router;
