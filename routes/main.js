const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const { getCountry, getInfoClientAll } = require('../utils/utils.js');
const jwt = require('jwt-decode')
require('dotenv').config()

const Router = express.Router();
const country = getCountry();

//pipeline keok.// //
Router.post('/app/redirect', async function (req, res) {
  const {auth, merchant} = req.body;
  try {

    logger.info(`Request http://10.9.43.2:2023. data: ${auth} merchant: ${merchant}`); //

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
        const url = response.data.url;

        const expired = new Date(new Date().getTime() + (parseInt(process.env.EXPIRED_SESSION) || 259200000));
        data.expired_date = expired;
        data.username = splitlogin[0];
        data['is_header_name_and_toast'] = false;

        if (data.rc === '00') {

          if(merchant !== null && merchant !== undefined){  

            //update session khusus merchant.
            req.session['khusus_merchant'] = JSON.stringify(
              {
                data1:response.data['data1'],
                data2:response.data['data2'],
                url:url
              }
            )

            logger.info(`INSERTING khusus_merchant TO SESSION: ${JSON.stringify({
              data1:response.data['data1'],
              data2:response.data['data2'],
              url:url
            })}`);


            req.session['v_merchant'] = merchant;
            logger.info(`INSERTING v_merchant TO SESSION: ${merchant}`);

            const dekript_token = jwt.jwtDecode(data.token);
            logger.info(`Token dekript : ${JSON.stringify(dekript_token)}`);
  
            const tokenUidPin = await axios.post(`http://10.9.43.2:2023/index.php?dekrip=null`, {
              dekrip:dekript_token.data
            });
  
            logger.info(`Response [TOKEN] http://10.9.43.2:2023. data: ${tokenUidPin.data !== null && tokenUidPin.data !== '' ? '------' : 'Not Found!'}`);
            req.session['v_session_uid_pin'] = tokenUidPin.data;

          }
          
          req.session['v_session'] = data.token;
          req.session['expired_session'] = expired;
          req.session['v_uname'] = splitlogin[0] || '';
          logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);
    
        }        
    
        logger.info(`Response /app/redirect: ${JSON.stringify(data)}`);
        return res.send(data);
    }else{

      return res.send({
        rc: '03',
        rd: 'Login failed.'
      });

    }

  } catch (error) {
    logger.error(`Error /app/redirect: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});


Router.post('/app/sign_in', async function (req, res) {
  const { username, password, token } = req.body;
  const captcha_keys = '6LdGRpEoAAAAAAUGROG0BOUf1vl0uXUErtLl-knf';

  logger.info(`Request /app/sign_in: ${JSON.stringify(req.body)}`);
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
    
        const expired = new Date(new Date().getTime() + (parseInt(process.env.EXPIRED_SESSION) || 259200000));
        data.expired_date = expired;
        data['is_header_name_and_toast'] = true;

        if (data.rc == '00') {
          req.session['v_session'] = data.token;
          req.session['v_uname'] = username;
          req.session['expired_session'] = expired;
    
          logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);
    
        }
    
        logger.info(`Response /app/sign_in: ${JSON.stringify(data)}`);
        return res.send(data);
    }else{

      return res.send({
        rc: '04',
        rd: 'Captcha anda tidak valid.'
      });

    }


  } catch (error) {
    logger.error(`Error /app/redirect: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});


Router.post('/is_merchant', async function (req, res) {
  const { token } = req.body;

  try {

    const session = req.session['v_session'];

    //
    if(token != session){
       return res.send({rc:"03", rd:"You must be login!."});
    }

    //
    if( req.session['v_merchant'] === undefined || req.session['v_merchant']  === null){

      return res.send({rc:"03", rd:"Merchant isn't found, Please Input yurr merchant!."});

    }

    return res.send({
      rc:'00',
      rd:"success",
    });

  } catch (error) {
    logger.error(`Error /app/account: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});

Router.post('/app/account', async function (req, res) {
  const { token } = req.body;
  logger.info(`Request /app/account: ${JSON.stringify(req.body)}`);

  try {
    const { data } = await axios.post(`${process.env.URL_HIT}/app/account`, {
      token: token,
    });

    logger.info(`Response /app/account: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /app/account: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});


Router.post('/refresh-date', async function (req, res) {
  const { token } = req.body;
  logger.info(`Request /refresh-date: ${JSON.stringify(req.body)}`);

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
    logger.error(`Error /refresh-date: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});


Router.post('/app/sign_out', async function (req, res) {
  const { token } = req.body;
  const data = req.body;
  logger.info(`Request /app/sign_out: ${JSON.stringify(data)}`);

  try {
    const { data } = await axios.post(`${process.env.URL_HIT}/app/sign_out`, {
      token: token,
    });

    req.session.destroy()

    logger.info(`Response /app/sign_out: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /app/sign_out: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });
  }
});


Router.get('/country', (req, res) => {

  return res.status(200).json(country);

});

Router.post('/app/transaction_list', async function (req, res) {

  try {

    const { token, product } = req.body;
    logger.info(`Request /app/transaction_list: ${JSON.stringify(req.body)}`);

    const requests = {};
    requests['username'] = req.session['v_uname'];
    const merchart = req.session['v_merchant'];
    const username = req.session['v_uname'];

    logger.info(`Request /app/transaction_list [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);
    
    if(merchart !== undefined && merchart !== null) {
        
      requests['username'] =  requests['username'] + '#' + merchart;
    }

    const { data } = await axios.post(`${process.env.URL_HIT}/app/transaction_list`, {
      token: token,
      product: product,
      ...requests
    });

    logger.info(`Response /app/transaction_list: ${JSON.stringify(data)}`);
    return res.send(data);
  } catch (error) {
    logger.error(`Error /app/transaction_list: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});


Router.post('/app/transaction_book_list', async function (req, res) {
  
  try {

      const { token, product, startDate, endDate } = req.body;  
      const requests = {};

      requests['username'] = req.session['v_uname'];
      const merchart = req.session['v_merchant'];
      const username = req.session['v_uname'];

      logger.info(`Request /app/transaction_book_list [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);
      
      if(merchart !== undefined && merchart !== null) {
          
        requests['username'] =  requests['username'] + '#' + merchart;
      }

      logger.info(`Request /app/transaction_book_list: ${JSON.stringify({
        token: token,
        product: product,
        startDate,
        endDate,
        ...requests
      })}`);

      const { data } = await axios.post(`${process.env.URL_HIT}/app/transaction_book_list`, {
        token: token,
        product: product,
        startDate,
        endDate,
        ...requests
      });

      logger.info(`Response /app/transaction_book_list: ${JSON.stringify(data)}`);
      return res.send(data);
  } catch (error) {
    logger.error(`Error /app/transaction_book_list: ${error.message}`);
    return res.status(200).send({ rc: '68', rd: 'Internal Server Error.' });

  }
});

module.exports = Router;
