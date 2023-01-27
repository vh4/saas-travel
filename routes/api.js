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

    const data = req.body;
    console.log(req.body);

    request.post(
        `${process.env.URL_HIT}/travel/flight/search`,
        {
          json: data
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

Router.post('/travel/flight/airport', function (req, res) {

  const {
    product, token
  } = req.body;

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


//khusus fast tavel bang

Router.post('/travel/train/search', function (req, res) {

  const {
    productCode, origin, destination, date, token
  } = req.body;

  console.log(req.body);

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


Router.post('/travel/train/get_seat_layout', function (req, res) {

  const {
    productCode, origin, destination, date, token, trainNumber
  } = req.body;

  console.log(req.body);

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
          return
        }
        return res.send(body)
      }
    )

});

Router.post('/travel/train/book', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/train/book`,
      {
        json: data
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

Router.post('/travel/train/payment', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/train/payment`,
      {
        json: data
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


Router.post('/travel/train/change_seat', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/train/change_seat`,
      {
        json: data
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

Router.post('/travel/train/fare', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/train/fare`,
      {
        json: data
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

Router.post('/travel/flight/fare', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/flight/fare`,
      {
        json: data
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

Router.post('/travel/flight/book', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/flight/book`,
      {
        json: data
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

Router.post('/travel/flight/payment', function (req, res) {

  const data = req.body;

  console.log(data);

  request.post(
    `${process.env.URL_HIT}/travel/flight/payment`,
      {
        json: data
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


//pelni

Router.post('/travel/pelni/get_origin', function (req, res) {

  const data = req.body;

  request.post(
    `${process.env.URL_HIT}/travel/pelni/get_origin`,
      {
        json: data
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


Router.post('/travel/pelni/search', function (req, res) {

  const data = req.body;

  request.post(
    `${process.env.URL_HIT}/travel/pelni/search`,
      {
        json: data
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