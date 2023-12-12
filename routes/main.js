const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const { getCountry, getInfoClientAll } = require('../utils/utils.js');
require('dotenv').config()

const Router = express.Router();
const country = getCountry();

//pipeline keok.// //
Router.post('/travel/app/redirect', async function (req, res) {
  const {auth, merchant} = req.body;
  try {

    logger.info(`Request http://10.9.43.2:2023. data: ${auth}`); //

    const dekript = await axios.post(`http://10.9.43.2:2023/index.php?dekrip=null`, {
      dekrip:auth
    });

    logger.info(`Response http://10.9.43.2:2023. data: ${dekript.data}`);

    if(dekript.data !== undefined && dekript.data !== null && dekript.data?.trim() !== '') {

        const splitlogin = dekript.data.split('|');
        logger.info(`Request /auth: username: ${splitlogin[0]} password: -------`); //

        logger.info(`Request HIT RAJABILLER JSON: ${JSON.stringify({
          username: splitlogin[0] || '',
          method: "rajabiller.login_travel",
          info: JSON.stringify(getInfoClientAll(req)),
          from: 'Web Travel Auth'
        })}`); //

        const response = await axios.post(process.env.HOST_AUTH, {
          username: splitlogin[0] || '',
          method: "rajabiller.login_travel",
          password: splitlogin[1] || '',
          info: JSON.stringify(getInfoClientAll(req), null, 4),
          from: 'Web Travel Auth'
        });
    

        logger.info(`Response HIT RAJABILLER JSON: ${JSON.stringify(response?.data)}`);
    
        if (response.data.rc !== '00') {
          return res.send({
            rc: response.data.rc,
            rd: response.data.rd
          });
        }
    
        const data = response.data;
    
        const expired = new Date(new Date().getTime() + 60 * 60 * 1000);
        data.expired_date = expired;
        data.username = splitlogin[0];
        data['is_header_name_and_toast'] = false;

        if (data.rc == '00') {
          req.session['v_session'] = data.token;
          req.session['expired_session'] = expired;
          req.session['v_uname'] = splitlogin[0] || '';
          req.session['v_merchant'] = merchant
    
          logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);
    
        }        
    
        logger.info(`Response /travel/app/redirect: ${JSON.stringify(data)}`);
        return res.send(data);

    }else{

      return res.send({
        rc: '03',
        rd: 'Login failed.'
      });

    }

  } catch (error) {
    logger.error(`Error /travel/app/redirect: ${error.message}`);

    return res.send({
      rc: '03',
      rd: error.message
    });

  }
});


Router.post('/travel/app/sign_in', async function (req, res) {
  const { username, password, token } = req.body;
  const captcha_keys = '6LdGRpEoAAAAAAUGROG0BOUf1vl0uXUErtLl-knf';

  logger.info(`Request /travel/app/sign_in: ${JSON.stringify(req.body)}`);
  logger.info(`Request HIT API RAJABILLER JSON: ${JSON.stringify({
    username: username,
    method: "rajabiller.login_travel",
    token:token,
    info: JSON.stringify(getInfoClientAll(req)),
    from: 'Web Travel Auth'
  })}`);

  try {

    const captcharesponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${captcha_keys}&response=${token}`)
    logger.info(`Response Captcha: ${JSON.stringify(captcharesponse.data)}`);

    if(captcharesponse.data.success === true){

        const response = await axios.post(process.env.HOST_AUTH, {
          username: username,
          method: "rajabiller.login_travel",
          password: password,
          info: JSON.stringify(getInfoClientAll(req), null, 4),
          from: 'Web Travel Input Form Modal'
        });
    
        logger.info(`Response HIT RAJABILLER JSON: ${JSON.stringify(response.data)}`);
        //
        if (response.data.rc !== '00') {
          return res.send({
            rc: response.data.rc,
            rd: response.data.rd
          });
        }
    
        const data = response.data;
    
        const expired = new Date(new Date().getTime() + 60 * 60 * 1000);
        data.expired_date = expired;
        data['is_header_name_and_toast'] = true;

        if (data.rc == '00') {
          req.session['v_session'] = data.token;
          req.session['v_uname'] = username;
          req.session['expired_session'] = expired;
    
          logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);
    
        }
    
        logger.info(`Response /travel/app/sign_in: ${JSON.stringify(data)}`);
        return res.send(data);
    }else{

      return res.send({
        rc: '04',
        rd: 'Captcha anda tidak valid.'
      });

    }


  } catch (error) {
    logger.error(`Error /travel/app/redirect: ${error.message}`);
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

    req.session.destroy()

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

//get country
Router.get('/travel/country', (req, res) => {

  return res.status(200).json(country);

})

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
