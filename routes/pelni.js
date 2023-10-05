const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const { v4:uuidv4} = require('uuid');
const { AuthLogin } = require('../middleware/auth.js');
const { apiLimiter } = require('../middleware/limit.js');

require('dotenv').config()
const Router = express.Router();

async function makeAxiosPost(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//get get_origin
Router.post('/travel/pelni/get_origin', async (req, res) => {
  const data = req.body;
  logger.info(`Request /travel/pelni/get_origin: ${JSON.stringify(data)}`);
  try {
    const response = await makeAxiosPost(`${process.env.URL_HIT}/travel/pelni/get_origin`, data);
    logger.info(`Response /travel/pelni/get_origin: ${JSON.stringify(response)}`);
    return res.send(response);
  } catch (error) {
    logger.error(`Error /travel/pelni/get_origin: ${error.message}`);
    return res.status(500).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

//get check_availability
Router.post('/travel/pelni/check_availability', async (req, res) => {
  const data = req.body;
  logger.info(`Request /travel/pelni/check_availability: ${JSON.stringify(data)}`);
  try {
    const response = await makeAxiosPost(`${process.env.URL_HIT}/travel/pelni/check_availability`, data);
    logger.info(`Response /travel/pelni/check_availability: ${JSON.stringify(response)}`);
    return res.send(response);
  } catch (error) {
    logger.error(`Error /travel/pelni/check_availability: ${error.message}`);
    return res.status(500).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

//pelni fare
Router.post('/travel/pelni/fare', async (req, res) => {
  const data = req.body;
  logger.info(`Request /travel/pelni/fare: ${JSON.stringify(data)}`);
  try {
    const response = await makeAxiosPost(`${process.env.URL_HIT}/travel/pelni/fare`, data);
    logger.info(`Response /travel/pelni/fare: ${JSON.stringify(response)}`);
    return res.send(response);
  } catch (error) {
    logger.error(`Error /travel/pelni/fare: ${error.message}`);
    return res.status(500).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

//pelni search
Router.post('/travel/pelni/search', async (req, res) => {
  const data = req.body;
  logger.info(`Request /travel/pelni/search: ${JSON.stringify(data)}`);
  try {
    const response = await makeAxiosPost(`${process.env.URL_HIT}/travel/pelni/search`, data);
    logger.info(`Response /travel/pelni/search: ${JSON.stringify(response)}`);
    return res.send(response);
  } catch (error) {
    logger.error(`Error /travel/pelni/search: ${error.message}`);
    return res.status(500).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});

//get p_search => inserting data detail pelni to session
Router.post('/travel/pelni/search/p_search', AuthLogin, apiLimiter, async (req, res) => {
	const data = req.body;
	
	if(typeof data == 'object'){
		logger.info(`INSERT SESSION /travel/pelni/search/p_search: ${JSON.stringify(data)}`);

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

//get p_search => retrieve data detail pelni to session. for booking information UI.
Router.get('/travel/pelni/search/p_search/:id', AuthLogin, async (req, res) => {
	const uuid = req.params.id;
	logger.info(`PARAMS /travel/pelni/search/p_search/:id: ${uuid}`);

	const data = req.session[uuid];
	
	if(data){
		logger.info(`GETTING DATA SESSION /travel/pelni/search/p_search/:id: ${JSON.stringify(data)}`);
		return res.send(data);

	}else{
		return res.send({
			rc:'03',
			rd:'ID tidak ditemukan.'
		})
	}

});

//insert data booking to session storage.
Router.post('/travel/pelni/book', async (req, res) => {
  const data = req.body;
  logger.info(`Request /travel/pelni/book: ${JSON.stringify(data)}`);
  try {
    const response = await makeAxiosPost(`${process.env.URL_HIT}/travel/pelni/book`, data);
    logger.info(`Response /travel/pelni/book: ${JSON.stringify(response)}`);
    logger.info(`RC /travel/pelni/book: ${response.rc}`);

    if (response.rc == '00') { //insert session
      logger.info(`INSERT SESSION /travel/pelni/book: ${response.rc}`);
      req.session.pelni = response;
    }

    logger.info(`Response SESSION /travel/pelni/book: ${JSON.stringify(req.session['pelni'])}`);
    return res.send(response);
  } catch (error) {
    logger.error(`Timeout Error /travel/pelni/book: ${error.message}`);
    return res.status(500).send({ rc: '68', rd: 'Server Error, Gateway Timeout.' });
  }
  
});

//retrieve data bookign from session storage.
Router.get('/travel/pelni/book/:id', AuthLogin, (req, res) => {
  try {
    const bookingId = req.params.id;
    logger.info(`Request /travel/pelni/book/:id : ${JSON.stringify(bookingId)}`);

    if (bookingId == '' || bookingId == undefined) {
      return res.status(400).send({ rc: '03', rd: 'id transaction is empty.' });
    }

    const body = req.session.pelni;
    logger.info(`Response /travel/pelni/book/:id : ${JSON.stringify(body)}`);

    if (req.session) {
      if (req.session.pelni) {
        if (parseInt(bookingId) === parseInt(body.data.transactionId)) {
          return res.send(body);
        }
      } else {
        return res.status(400).send({ rc: '03', rd: 'Booking not found.' });
      }
    } else {
      return res.status(400).send({ rc: '03', rd: 'Session expired.' });
    }
  } catch (error) {
    logger.error(`Error: ${JSON.stringify(error.message)}`);
    return res.status(500).send({ rc: '68', rd: `Internal Server Error.` });
  }
});

//insert data book_info to session storage.
Router.post('/travel/pelni/book_info', AuthLogin, apiLimiter, async (req, res) => {
  const data = req.body;
  logger.info(`Request /travel/pelni/book_info: ${JSON.stringify(data)}`);
  try {
    const response = await makeAxiosPost(`${process.env.URL_HIT}/travel/pelni/book_info`, data);
    logger.info(`Response /travel/pelni/book_info: ${JSON.stringify(response)}`);

    if (response.rc == '00') {
      logger.info(`INSERT SESSION /travel/pelni/book_info: ${response.rc}`);
      req.session['pelnibookinfo'] = response;
    }

    return res.send(response);
  } catch (error) {
    logger.error(`Timeout Error /travel/pelni/book_info: ${error.message}`);
    return res.status(500).send({ rc: '68', rd: 'Server Error, Gateway Timeout.' });
  }
});

//retrieve data book_info from session storage.
Router.get('/travel/pelni/book_info/:id', AuthLogin, (req, res) => {
  try {
    const bookingInfoId = req.params.id;
    logger.info(`Request /travel/pelni/book_info/:id : ${bookingInfoId}`);

    if (bookingInfoId == '' || bookingInfoId == undefined) {
      return res.status(400).send({ rc: '03', rd: 'id transaction is empty.' });
    }

    const body = req.session['pelnibookinfo'];
    logger.info(`Response /travel/pelni/book_info/:id : ${JSON.stringify(body)}`);

    if (req.session) {
      if (body) {
        try {
          if (parseInt(bookingInfoId) === parseInt(body.transactionId)) {
            return res.send(body);
          } else {
            return res.status(400).send({ rc: '03', rd: 'Invalid transaction ID.' });
          }
        } catch (error) {
          logger.error(`Error parsing JSON: ${error.message}`);
          return res.status(500).send({ rc: '68', rd: 'Internal Server Error.' });
        }
      } else {
        return res.status(400).send({ rc: '03', rd: 'Booking info not found.' });
      }
    } else {
      return res.status(400).send({ rc: '03', rd: 'Session expired.' });
    }
  } catch (error) {
    logger.error(`Error: ${JSON.stringify(error.message)}`);
    return res.status(500).send({ rc: '68', rd: `Internal Server Error.` });
  }
});


//insert data passengers to session storage.
Router.post('/travel/pelni/booking/passengers', AuthLogin, apiLimiter, async (req, res) => {
	const data = req.body;
	
	if(typeof data == 'object'){
		logger.info(`INSERT SESSION /travel/pelni/booking/passengers: ${JSON.stringify(data)}`);

		req.session[data.transactionId] = data;

		return res.send({
			uuid:data.transactionId,
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

//retrieve data passengers from session storage.
Router.get('/travel/pelni/booking/passengers/:id',AuthLogin, async (req, res) => {
	const transactionId = req.params.id;
	logger.info(`PARAMS /travel/pelni/booking/passengers/:id: ${transactionId}`);

	const data = req.session[transactionId];
	
	if(data){
		logger.info(`GETTING DATA SESSION /travel/pelni/booking/passengers/:id: ${JSON.stringify(data)}`);
		return res.send({
			rc: '00',
			rd:'success',
			...data
		});

	}else{
		return res.send({
			rc:'03',
			rd:'ID tidak ditemukan.'
		})
	}
});

module.exports = Router;
