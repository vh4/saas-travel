const express = require('express');
const request = require('request');
const logger = require('../utils/logger.js');
require('dotenv').config()

const Router = express.Router();

Router.post('/travel/app/sign_in', function (req, res) {

    const {outletId, pin, key} = req.body;
    logger.info(`Request /travel/app/sign_in: ${JSON.stringify(req.body)}`);

    request.post(
        `${process.env.URL_HIT}/travel/app/sign_in`,
        {
          json: 
          {
            outletId: outletId,
            pin: pin,
            key: key
          }
        },

        (error, response, body) => {
          if (error) {
            console.error(error)
            logger.error(`Error /travel/app/sign_in: ${error.message}`);
            return;
          }

          const data = body;
          data.expired_date = new Date(new Date().getTime() + 60 * 60 * 1000);

          logger.info(`Responose /travel/app/sign_in: ${JSON.stringify(data)}`);

          return res.send(data)
        }
      )

});

Router.post('/travel/app/account', function (req, res) {

    const {token} = req.body;
    logger.info(`Request /travel/app/account: ${JSON.stringify(req.body)}`);

    request.post(
        `${process.env.URL_HIT}/travel/app/account`,
        {
          json: 
          {
            token: token,
          }
        },
        (error, response, body) => {
          if (error) {
            console.error(error);
            logger.error(`Error /travel/app/account: ${error.message}`);

            return
          }

          logger.info(`Response /travel/app/account: ${JSON.stringify(body)}`);
          return res.send(body)
        }
      )

});

Router.post('/travel/app/sign_out', function (req, res) {

    const {token} = req.body;
    const data = req.body;
    logger.info(`Request /travel/app/sign_out: ${JSON.stringify(data)}`);


    request.post(
        `${process.env.URL_HIT}/travel/app/sign_out`,
        {
          json: 
          {
            token: token,
          }
        },
        (error, response, body) => {
          if (error) {
            console.error(error)
            logger.error(`Error: /travel/app/sign_out: ${error.message}`);
            return
          }

          logger.info(`Response /travel/app/sign_out: ${JSON.stringify(body)}`);

          return res.send(body)
        }
      )

});

Router.post('/travel/app/transaction_list', function (req, res) {

    const {token, product} = req.body;
    logger.info(`Request /travel/app/transaction_list: ${JSON.stringify(req.body)}`);

    request.post(
        `${process.env.URL_HIT}/travel/app/transaction_list`,
        {
          json: 
          {
            token: token,
            product: product,
          }
        },
        (error, response, body) => {
          if (error) {
            console.error(error)
            logger.error(`Error /travel/app/transaction_list: ${error.message}`);

            return
          }
          logger.info(`Response /travel/app/transaction_list: ${JSON.stringify(body)}`);

          return res.send(body)
        }
      )

});

Router.post('/travel/app/transaction_book_list', function (req, res) {

    const {token, product} = req.body;
    logger.info(`Request /travel/app/transaction_book_list: ${JSON.stringify(req.body)}`);

    request.post(
        `${process.env.URL_HIT}/travel/app/transaction_book_list`,
        {
          json: 
          {
            token: token,
            product: product,
          }
        },
        (error, response, body) => {
          if (error) {
            console.error(error)
            logger.info(`Error /travel/app/transaction_book_list: ${error.message}`);

            return
          }

          logger.info(`Response /travel/app/transaction_book_list: ${JSON.stringify(body)}`);
          return res.send(body);
        }
      )

});

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

Router.post('/travel/train/station', function (req, res) {

  const {
    product, token
  } = req.body;

  logger.info(`Request /travel/train/station: ${JSON.stringify(req.body)}`);

  request.post(
      `${process.env.URL_HIT}/travel/train/station`,
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
          logger.error(`Error /travel/train/station: ${error.message}`);

          return
        }

        logger.info(`Response /travel/train/station: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});


//khusus fast tavel bang

Router.post('/travel/train/search', function (req, res) {

  const {
    productCode, origin, destination, date, token
  } = req.body;

  logger.info(`Request /travel/train/search: ${JSON.stringify(req.body)}`);


   request.post(
    `${process.env.URL_HIT}/travel/train/search`,
      {
        json: 
        {
          productCode, origin, destination, date, token
        }
      },
      (error, response, body)  => {
        if (error) {
          console.error(error)

          logger.error(`Error /travel/train/search: ${error.message}`);
          return
        }
        
        logger.info(`Response /travel/train/search: ${JSON.stringify(body)}`);

        return res.send(body)
      }
    )

});


Router.post('/travel/train/get_seat_layout', function (req, res) {

  const {
    productCode, origin, destination, date, token, trainNumber
  } = req.body;

  logger.info(`Request /travel/train/get_seat_layout: ${JSON.stringify(req.body)}`);


  request.post(
      `${process.env.URL_HIT}/travel/train/get_seat_layout`,
      {
        json: 
        {
          productCode, origin, destination, date, token, trainNumber
        }
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/train/get_seat_layout: ${error.message}`);
          return
        }

        logger.info(`Response /travel/train/get_seat_layout: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});

Router.post('/travel/train/book', function (req, res) {

  logger.info(`Request /travel/train/book: ${JSON.stringify(req.body)}`);

  request.post(
    `${process.env.URL_HIT}/travel/train/book`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/train/book: ${error.message}`);

          return
        }

        logger.info(`Response /travel/train/book: ${JSON.stringify(body)}`);

        return res.send(body)
      }
    )

});

Router.post('/travel/train/payment', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/train/payment: ${JSON.stringify(data)}`);

  request.post(
    `${process.env.URL_HIT}/travel/train/payment`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)

          logger.error(`Error /travel/train/payment: ${error.message}`);
          return
        }

        logger.info(`Response /travel/train/payment: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});


Router.post('/travel/train/change_seat', function (req, res) {

  const data = req.body;

  logger.info(`Request /travel/train/change_seat: ${JSON.stringify(data)}`);

  request.post(
    `${process.env.URL_HIT}/travel/train/change_seat`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)

          logger.error(`Error /travel/train/change_seat: ${error.message}`);
          return
        }

        logger.info(`Response /travel/train/change_seat: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});

Router.post('/travel/train/fare', function (req, res) {

  const data = req.body;

  logger.info(`Request /travel/train/fare: ${JSON.stringify(data)}`);


  request.post(
    `${process.env.URL_HIT}/travel/train/fare`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)

          logger.error(`Error /travel/train/fare: ${error.message}`);
          return
        }

        logger.info(`Response /travel/train/fare: ${JSON.stringify(body)}`);

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


//pelni

Router.post('/travel/pelni/get_origin', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/pelni/get_origin: ${JSON.stringify(data)}`);

  request.post(
    `${process.env.URL_HIT}/travel/pelni/get_origin`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/pelni/get_origin: ${error.message}`);

          return
        }

        logger.info(`Response /travel/pelni/get_origin: ${JSON.stringify(body)}`);

        return res.send(body)
      }
    )

});


Router.post('/travel/pelni/search', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/pelni/search: ${JSON.stringify(data)}`);

  request.post(
    `${process.env.URL_HIT}/travel/pelni/search`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/pelni/search: ${error.message}`);

          return
        }
        logger.info(`Response /travel/pelni/search: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});

Router.post('/travel/app/transaction_book_list', function (req, res) {

  const data = req.body;
  logger.info(`Request /travel/app/transaction_book_list: ${JSON.stringify(data)}`);

  request.post(
    `${process.env.URL_HIT}/travel/app/transaction_book_list`,
      {
        json: data
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          logger.error(`Error /travel/app/transaction_book_list: ${req.message}`);

          return
        }
        logger.info(`Response /travel/app/transaction_book_list: ${JSON.stringify(body)}`);
        return res.send(body)
      }
    )

});

module.exports = Router