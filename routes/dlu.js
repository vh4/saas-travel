const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
// const { v4:uuidv4} = require('uuid');
const {
    AuthLogin
} = require('../middleware/auth.js');
const {
    axiosSendCallback
} = require('../utils/utils.js');

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
Router.post('/ship/ship_harbor', async (req, res) => {
    const data = req.body;
    logger.info(`Request ${process.env.URL_HIT}/ship/ship_harbor: ${JSON.stringify(data)}`);
    try {
        const response = await axios.post(`${process.env.URL_HIT}/ship/ship_harbor`, data);
        logger.info(`Response ${process.env.URL_HIT}/ship/ship_harbor: ${JSON.stringify(response.data)}`);

        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /ship/ship_harbor: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

//get get_origin
Router.post('/ship/search', async (req, res) => {
    const data = req.body;
    logger.info(`Request ${process.env.URL_HIT}/ship/search: ${JSON.stringify(data)}`);
    try {
        const response = await axios.post(`${process.env.URL_HIT}/ship/search`, data);
        logger.info(`Response ${process.env.URL_HIT}/ship/search: ${JSON.stringify(response.data)}`);

        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /ship/search: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});

Router.post('/ship/fare', async (req, res) => {
    const data = req.body;
    logger.info(`Request ${process.env.URL_HIT}/ship/fare: ${JSON.stringify(data)}`);
    try {
        const response = await axios.post(`${process.env.URL_HIT}/ship/fare`, data);
        logger.info(`Response ${process.env.URL_HIT}/ship/fare: ${JSON.stringify(response.data)}`);

        return res.send(response.data);
    } catch (error) {
        logger.error(`Error /ship/fare: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});


Router.post('/ship/book', AuthLogin, async (req, res) => {

    try {

        const data = req.body;

        data['username'] = req.session['v_uname'];
        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /ship/book [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            data['username'] = data['username'] + '#' + merchart;

            if (req.session['khusus_merchant'] !== undefined && req.session['khusus_merchant'] !== null) {

                const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
                data['send_format'] = parseDataKhususMerchant.data1; //format json / text.

            }
        }

        logger.info(`Request /ship/book: ${JSON.stringify(data)}`);

        //booking pelni!
        const response = await makeAxiosPost(`${process.env.URL_HIT}/ship/book`, data);

        logger.info(`Response /ship/book: ${JSON.stringify(response)}`);

        //check if merchant data.
        if (merchart !== undefined && merchart !== null &&
            response.rc === '00' && response.data?.callbackData !== undefined && response.data?.callbackData !== null) {

            const parseDataKhususMerchant = JSON.parse(req.session['khusus_merchant']);
            const url = parseDataKhususMerchant.url

            logger.info(`Request URL ${url} [CALLBACK]: ${JSON.stringify(response.data?.callbackData)}`);

            // const sendCallbackTomerchant = await axios.post(
            //   url,
            //   response.data?.callbackData || null // callback data for mitra.
            // );

            // if(typeof sendCallbackTomerchant.data === "object"){
            //   logger.info(`Response URL ${url} [CALLBACK]: ${JSON.stringify(sendCallbackTomerchant.data)}`);
            // }else{
            //   logger.info(`Response URL ${url} [CALLBACK]: ${sendCallbackTomerchant.data}`);
            // }

            //response untuk mitra
            // response['callback'] = sendCallbackTomerchant.data;

            response.data['callback'] = JSON.stringify(response.data?.data?.callbackData) || null;
            return res.send(response);

        } else {

            //response global.
            response['callback'] = null;
            return res.send(response);

        }

    } catch (error) {
        logger.error(`Timeout Error /ship/book: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }

});

//callback khusus ship.
Router.post('/ship/callback', AuthLogin, async function(req, res) { // Menambahkan async

    try {

        const method = 'cekdlu'
        const {
            id_transaksi
        } = req.body;
        const type = 'ship';

        const response = await axiosSendCallback(req, method, id_transaksi, type);
        return res.send(response);

    } catch (error) {

        logger.error(`Error /ship/callback: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }

});

module.exports = Router;