const express = require('express');
const request = require('request');
const logger = require('../utils/logger.js');
require('dotenv').config()

const Router = express.Router();

Router.post('/travel/app/sign_in', function (req, res) {

    const {outletId, pin, key} = req.body;
    logger.info(`Request /travel/app/sign_in: ${JSON.stringify(req.body)}`);
    logger.info(`Request HIT API RAJABILLER JSON: ${JSON.stringify(

      {
        uid:outletId,
        method:"rajabiller.outlet_travel",
        pin:pin
      }
      
    )}`);
    
    request.post(

      `${process.env.HOST_AUTH}`,
      {
        url: `${process.env.HOST_AUTH}`,
        json: {
          uid: outletId,
          method: "rajabiller.outlet_travel",
          pin: pin
        },
        rejectUnauthorized: false // Opsional, hanya digunakan untuk debugging
      },

      (err, response, body) => {

        if (err) {
          logger.error(`Error Sign in HIT RAJABILLER JSON: ${err.message}`);
          return;
        }

        logger.info(`Responose HIT RAJABILLER JSON: ${JSON.stringify(body)}`);

        if(response.statusCode != 200){

          return res.send({
            rc: '03',
            rd: body
          });

        }

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
              logger.error(`Error /travel/app/sign_in: ${error.message}`);
              return;
            }
  
            const data = body;
            data.expired_date = new Date(new Date().getTime() + 60 * 60 * 1000);
  
            logger.info(`Responose /travel/app/sign_in: ${JSON.stringify(data)}`);
  
            return res.send(data)
          }
        )

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