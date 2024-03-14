const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
// const { v4:uuidv4} = require('uuid');
const { AuthLogin } = require('../middleware/auth.js');
const { axiosSendCallback } = require('../utils/utils.js');

require('dotenv').config()
const Router = express.Router();


//get get_origin
Router.post('/ship/ship_harbor', async (req, res) => {
	const data = req.body;
	logger.info(`Request ${process.env.URL_HIT}/ship/ship_harbor: ${JSON.stringify(data)}`);
	try {
	  const response = await axios.post(`${process.env.URL_HIT}/ship/ship_harbor`, data);
	  logger.info(`Response ${process.env.URL_HIT}/ship/ship_harbor: ${JSON.stringify(response.data)}`);
 
	  return res.send(response.data);
	} catch (error) {
	  logger.error(`Error /ship/ship_harbor: ${error.message}`);
	  return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
	}
});

//get get_origin
Router.post('/ship/search', async (req, res) => {
	const data = req.body;
	logger.info(`Request ${process.env.URL_HIT}/ship/search: ${JSON.stringify(data)}`);
	try {
	  const response = await axios.post(`${process.env.URL_HIT}/ship/search`, data);
	  console.log(response.data)
	  logger.info(`Response ${process.env.URL_HIT}/ship/search: ${JSON.stringify(response.data)}`);
 
	  return res.send(response.data);
	} catch (error) {
	  logger.error(`Error /ship/search: ${error.message}`);
	  return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
	}
});

Router.post('/ship/fare', async (req, res) => {
	const data = req.body;
	logger.info(`Request ${process.env.URL_HIT}/ship/fare: ${JSON.stringify(data)}`);
	try {
	  const response = await axios.post(`${process.env.URL_HIT}/ship/fare`, data);
	  console.log(response.data)
	  logger.info(`Response ${process.env.URL_HIT}/ship/fare: ${JSON.stringify(response.data)}`);
 
	  return res.send(response.data);
	} catch (error) {
	  logger.error(`Error /ship/fare: ${error.message}`);
	  return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
	}
});


Router.post('/ship/book', async (req, res) => {
	const data = req.body;
	logger.info(`Request ${process.env.URL_HIT}/ship/book: ${JSON.stringify(data)}`);
	try {
	  const response = await axios.post(`${process.env.URL_HIT}/ship/book`, data);
	  console.log(response.data)
	  logger.info(`Response ${process.env.URL_HIT}/ship/book: ${JSON.stringify(response.data)}`);
 
	  return res.send(response.data);
	} catch (error) {
	  logger.error(`Error /ship/book: ${error.message}`);
	  return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
	}
});

module.exports = Router;


