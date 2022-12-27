const express = require('express');
const request = require('request');
require('dotenv').config()

const Router = express.Router();

Router.post('/travel/app/sign_in', function (req, res) {

    const {outletId, pin, key} = req.body;

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
            return
          }
          return res.send(body)
        }
      )

});

Router.post('/travel/app/account', function (req, res) {

    const {token} = req.body;

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
            console.error(error)
            return
          }
          return res.send(body)
        }
      )

});

Router.post('/travel/app/sign_out', function (req, res) {

    const {token} = req.body;

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
            return
          }
          return res.send(body)
        }
      )

});

Router.post('/travel/app/transaction_list', function (req, res) {

    const {token, product} = req.body;

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
            return
          }
          return res.send(body)
        }
      )

});

Router.post('/travel/app/transaction_book_list', function (req, res) {

    const {token, product} = req.body;

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
            return
          }
          return res.send(body)
        }
      )

});

Router.post('/travel/flight/search', function (req, res) {

    const {token, airline, departure, arrival, departureDate, returnDate, 
        isLowestPrice = true, adult, child, infant 
    
    } = req.body;

    request.post(
        `${process.env.URL_HIT}/travel/flight/search`,
        {
          json: 
          {
            token,
            airline, departure, arrival, departureDate, returnDate, isLowestPrice,
            adult, child, infant 
          }
        },
        (error, response, body) => {
          if (error) {
            console.error(error)
            return
          }
          return res.send(body)
        }
      )

});


Router.post('/travel/flight/airline', function (req, res) {

  const {
    product, token
  } = req.body;

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
          return
        }
        return res.send(body)
      }
    )

});

Router.post('/travel/train/station', function (req, res) {

  const {
    product, token
  } = req.body;

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
          return
        }
        return res.send(body)
      }
    )

});

Router.post('/travel/train/search', function (req, res) {

  const {
    productCode, origin, destination, date, token
  } = req.body;

  request.post(
      `${process.env.URL_HIT}/travel/train/search`,
      {
        json: 
        {
          productCode, origin, destination, date, token
        }
      },
      (error, response, body) => {
        if (error) {
          console.error(error)
          return
        }
        return res.send(body)
      }
    )

});

module.exports = Router