const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
require('dotenv').config()
const https = require('https')

const Router = express.Router();

Router.post('/travel/app/sign_in', async function (req, res) {
  const { username, password, key } = req.body;
  logger.info(`Request /travel/app/sign_in: ${JSON.stringify(req.body)}`);
  logger.info(`Request HIT API RAJABILLER JSON: ${JSON.stringify({
    username: username,
    method: "rajabiller.login_travel",
    password: password
  })}`);

  try {
    const response = await axios.post(process.env.HOST_AUTH, {
      username: username,
      method: "rajabiller.login_travel",
      password: password
    });

    logger.info(`Response HIT RAJABILLER JSON: ${JSON.stringify(response.data)}`);

    if (response.data.rc !== '00') {
      return res.send({
        rc: response.data.rc,
        rd: response.data.rd
      });
    }

    const data = response.data;

    const expired = new Date(new Date().getTime() + 60 * 60 * 1000);
    data.expired_date = expired;

    if (data.rc == '00') {
      req.session['v_session'] = data.token;
      req.session['expired_session'] = expired;

      logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);

    }

    logger.info(`Response /travel/app/sign_in: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /travel/app/sign_in: ${error.message}`);
    return res.send({
      rc: '68',
      rd: error.message
    });
  }
});

Router.post('/travel/app/account', async function (req, res) {
  const { token } = req.body;
  logger.info(`Request /travel/app/account: ${JSON.stringify(req.body)}`);

  try {
    const { data } = await axios.post(`${process.env.URL_HIT}/travel/app/account`, {
      token: token,
    });

    logger.info(`Response /travel/app/account: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /travel/app/account: ${error.message}`);
    return res.send({
      rc: '68',
      rd: error.message
    });
  }
});

Router.post('/travel/refresh-date', async function (req, res) {
  const { token } = req.body;
  logger.info(`Request /travel/refresh-date: ${JSON.stringify(req.body)}`);

  try {

    const verifyToken = req.session['v_session'];
    const expired = req.session['expired_session'];

    if(verifyToken == null || verifyToken == undefined){
      return res.send({
        rc: '03',
        rd: 'Anda harus login terlebih dahulu.'
      });
    }

    if(token == null || token == undefined){
      return res.send({
        rc: '03',
        rd: 'Anda harus login terlebih dahulu.'
      });
    }

    if(expired == null || expired == undefined){
      return res.send({
        rc: '03',
        rd: 'EXpired Date is Expired.'
      });
    }

    if(token == verifyToken) {

      return res.send({
        data:{
          rc: '00',
          rd: 'success',
          data:{
            expired_date: expired
          }
        }
      });

    }else{
      return res.send({
        rc: '03',
        rd: 'Expired date tidak ditemukan.'
      });

    }

  } catch (error) {
    logger.error(`Error /travel/app/account: ${error.message}`);
    return res.send({
      rc: '68',
      rd: error.message
    });
  }
});

Router.post('/travel/app/sign_out', async function (req, res) {
  const { token } = req.body;
  const data = req.body;
  logger.info(`Request /travel/app/sign_out: ${JSON.stringify(data)}`);

  try {
    const { data } = await axios.post(`${process.env.URL_HIT}/travel/app/sign_out`, {
      token: token,
    });

    logger.info(`Response /travel/app/sign_out: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /travel/app/sign_out: ${error.message}`);
    return res.send({
      rc: '68',
      rd: error.message
    });
  }
});

Router.post('/travel/app/transaction_list', async function (req, res) {
  const { token, product } = req.body;
  logger.info(`Request /travel/app/transaction_list: ${JSON.stringify(req.body)}`);

  try {
    const { data } = await axios.post(`${process.env.URL_HIT}/travel/app/transaction_list`, {
      token: token,
      product: product,
    });

    logger.info(`Response /travel/app/transaction_list: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /travel/app/transaction_list: ${error.message}`);
    return res.send({
      rc: '68',
      rd: error.message
    });
  }
});

Router.post('/travel/app/transaction_book_list', async function (req, res) {
  const { token, product } = req.body;
  logger.info(`Request /travel/app/transaction_book_list: ${JSON.stringify(req.body)}`);

  try {
    const { data } = await axios.post(`${process.env.URL_HIT}/travel/app/transaction_book_list`, {
      token: token,
      product: product,
    });

    logger.info(`Response /travel/app/transaction_book_list: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /travel/app/transaction_book_list: ${error.message}`);
    return res.send({
      rc: '68',
      rd: error.message
    });
  }
});

module.exports = Router;
