const express = require('express');
const request = require('request');
const logger = require('../utils/logger.js');
require('dotenv').config()

const Router = express.Router();



Router.post('/travel/flight/search', function (req, res) {

    const data = req.body;
    logger.info(`Request /travel/flight/search: ${JSON.stringify(data)}`);


    request.post(
        `${process.env.URL_HIT}/travel/flight/search`,
        {
          json: data
        },
        (error, response, body) => {
          if (error) {
            console.error(error)
            logger.error(`Error /travel/flight/search: ${error.message}`);
            return
          }

          logger.info(`Response /travel/flight/search: ${JSON.stringify(body)}`);

          return res.send(body)
        }
      )

});


Router.post('/travel/flight/airline', function (req, res) {

  const {
    product, token
  } = req.body;

  logger.info(`Request /travel/flight/airline: ${JSON.stringify(req.body)}`);

  request.post(
      `${process.env.URL_HIT}/travel/flight/airline`,
      {
        json: 
        {
          product,
          token
        }
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/flight/airline: ${error.message}`);

          return
        }

        logger.info(`Response /travel/flight/airline: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});

Router.post('/travel/flight/airport', function (req, res) {

  const {
    product, token
  } = req.body;

  logger.info(`Request /travel/flight/airport: ${JSON.stringify(req.body)}`);


  request.post(
      `${process.env.URL_HIT}/travel/flight/airport`,
      {
        json: 
        {
          product,
          token
        }
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/flight/airport: ${error.message}`);

          return
        }

        logger.info(`Response /travel/flight/airport: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});

Router.post('/travel/flight/fare', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/flight/fare: ${JSON.stringify(data)}`);


  request.post(
    `${process.env.URL_HIT}/travel/flight/fare`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)

          logger.error(`Error /travel/flight/fare: ${error.message}`);
          return
        }

        logger.info(`Response /travel/flight/fare: ${JSON.stringify(body)}`);

        return res.send(body)
      }
    )

});

Router.post('/travel/flight/book', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/flight/book: ${JSON.stringify(data)}`);


  request.post(
    `${process.env.URL_HIT}/travel/flight/book`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/flight/book: ${error.message}`);
          return
        }

        logger.info(`Response /travel/flight/book: ${JSON.stringify(body)}`);


        return res.send(body);

      }
    )

});

Router.post('/travel/flight/payment', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/flight/payment: ${JSON.stringify(data)}`);


  request.post(
    `${process.env.URL_HIT}/travel/flight/payment`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/flight/payment: ${error.message}`);

          return
        }

        logger.info(`Response /travel/flight/payment: ${JSON.stringify(body)}`);

        return res.send(body);
      }
    )

});

module.exports = Router