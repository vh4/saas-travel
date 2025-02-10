const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger.js');
const {
    getCountry,
    getInfoClientAll,
    jwtDecoded
} = require('../utils/utils.js');
const { WhitelistDevelByIdOutlet } = require('../model/global.js');
// const {
//     WhiteListtravelFunction,
//     IsSimulatetravelFunction
// } = require('../model/global.js');
require('dotenv').config()
const Router = express.Router();
const country = getCountry();

//pipeline keok.// //
Router.post('/app/redirect', async function(req, res) {
    const {
        auth,
        merchant,
        type
    } = req.body;
    try {

        logger.info(`Request ${process.env.URL_AUTH_REDIRECT}. data: ${auth} merchant: ${merchant}`); //

        //1. get username and password
        const dekript = await axios.post(`${process.env.URL_AUTH_REDIRECT}/index.php?dekrip=null`, {
            dekrip: auth
        });
        
        //2. check if exists or valid
        if (dekript.data !== undefined && dekript.data !== null && dekript.data?.trim() !== '') {

            const splitlogin = dekript.data.split('|');
            const requestPayload = {
                username: splitlogin[0] || '',
                method: "rajabiller.login_travel",
                password: splitlogin[1] || '',
                info: JSON.stringify(getInfoClientAll(req), null, 4),
                from: 'Web Travel Auth'
            };

            const typeFromPathWeb = splitlogin[3] || '';

            // Log the request payload with masked password
            logger.info(`Request HIT RAJABILLER JSON: ${JSON.stringify({ ...requestPayload, password: '---------' })}`);

            //3. to getting accessToken and auth_page (kereta, pelni, plane)
            const response = await axios.post(process.env.HOST_AUTH, requestPayload);

            // Log the response payload with masked password
            logger.info(`Response HIT RAJABILLER JSON: ${JSON.stringify(response?.data)}`);

            if (response.data.rc !== '00') {
                return res.send({
                    rc: response.data.rc,
                    rd: response.data.rd
                });
            }

            const data = response.data;
            const url = response.data.url;
            const expired = new Date(new Date().getTime() + (parseInt(process.env.EXPIRED_SESSION) || 594800000));
            data.expired_date = expired;
            data.username = splitlogin[0];
            data['is_header_name_and_toast'] = false;

            //4. check is valid in via rajabiller.com
            if (data.rc === '00') {

                // if (merchant !== null && merchant !== undefined && url != '') {

                    // Define session data for merchant
                    const merchantSessionData = {
                        data1: response.data['data1'],
                        data2: response.data['data2'],
                        url: url
                    };

                    // Update session with merchant data
                    req.session['khusus_merchant'] = JSON.stringify(merchantSessionData);

                    // Log the merchant session insertion
                    logger.info(`[PREMIUM] INSERTING req.session['khusus_merchant'] TO SESSION /app/redirect: ${JSON.stringify(merchantSessionData)}`);
                    req.session['v_merchant'] = merchant;
                    req.session['id_outlet'] = data.id_outlet;
                    logger.info(`INSERTING req.session['v_merchant'] TO SESSION: ${merchant}`);

                    //5. separating by menu kereta, pelni, etc and insert to session for frontend.
                    const tokenUidPin = await axios.post(`${process.env.URL_AUTH_REDIRECT}/index.php?dekrip=null`, {
                        dekrip: type == 'auth' ? data.auth : data.page_auth[type]
                    });

                    if (!tokenUidPin.data || tokenUidPin.data == '') {
                        return res.send({
                            rc: '03',
                            rd: 'Login failed.'
                        });
                    }

                    //usertravel1|pass!|1730789008|kereta
                    const arr = tokenUidPin.data.split('|');
                    let typeCategory = arr[3];

                    //if not valid, then hardcode existing / default => the default is auth
                    if (!typeCategory || typeCategory == '') {
                        typeCategory = '';
                    }

                    if((typeFromPathWeb !== typeCategory)){
                        return res.send({
                            rc: '03',
                            rd: 'gagal!'
                        });
                    }
                    
                    logger.info(`Response [TOKEN] ${process.env.URL_AUTH_REDIRECT}. data: ${tokenUidPin.data !== null && tokenUidPin.data !== '' ? '------' : 'Not Found!'}`);
                    
                    //6. AMBIL UID DAN PIN lewat decoded token untuk booking di rajabiller dapatin callback.
                    const jwtDecodedResponse = await jwtDecoded(data.token);            
                    if (jwtDecodedResponse == undefined || jwtDecodedResponse == null || jwtDecodedResponse?.trim() == '') {
                        return res.send({
                            rc: '03',
                            rd: 'gagal!'
                        });
                    }

                    req.session['v_session_uid_pin'] = jwtDecodedResponse;
                    req.session['type'] = typeCategory

                }

                req.session['v_session'] = data.token;
                req.session['expired_session'] = expired;
                req.session['v_uname'] = splitlogin[0] || '';
                logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);

            }

            logger.info(`Response /app/redirect: ${JSON.stringify(data)}`);
            return res.send(data);
        // } else {

        //     return res.send({
        //         rc: '03',
        //         rd: 'Login failed.'
        //     });

        // }

    } catch (error) {
        logger.error(`Error /app/redirect: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});


Router.post('/app/sign_in', async function(req, res) {

    const {
            username,
            password,
            token
        } = req.body;
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

        if (captcharesponse.data.success === true) {

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

            const expired = new Date(new Date().getTime() + (parseInt(process.env.EXPIRED_SESSION) || 594800000));
            data.expired_date = expired;
            data['is_header_name_and_toast'] = true;

            if (data.rc == '00') {
                req.session['v_session'] = data.token;
                req.session['v_uname'] = username;
                req.session['expired_session'] = expired;

                const url = response.data.url;
                
                //menqambahkan merchant
                const merchantSessionData = {
                    data1: response.data['data1'],
                    data2: response.data['data2'],
                    url: url
                };

                logger.info(`[PREMIUM] INSERTING req.session['khusus_merchant'] TO SESSION /app/login: ${JSON.stringify(merchantSessionData)}`);
                req.session['v_merchant'] = '';
                req.session['id_outlet'] = data.id_outlet;

                // Update session with merchant data
                req.session['khusus_merchant'] = JSON.stringify(merchantSessionData);


                logger.info(`INSERTING TOKEN TO SESSION: ${JSON.stringify(data.token)}`);
                const jwtDecodedResponse = await jwtDecoded(data.token);            
                if (jwtDecodedResponse == undefined || jwtDecodedResponse == null || jwtDecodedResponse?.trim() == '') {
                    return res.send({
                        rc: '03',
                        rd: 'gagal login!'
                    });
                }
                req.session['v_session_uid_pin'] = jwtDecodedResponse;


            }

            logger.info(`Response /app/sign_in: ${JSON.stringify(data)}`);
            return res.send(data);
        } else {

            return res.send({
                rc: '04',
                rd: 'Captcha anda tidak valid.'
            });

        }


    } catch (error) {
        logger.error(`Error /app/redirect: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});

Router.post('/is_merchant', async function(req, res) {
    const {
        token
    } = req.body;

    try {

        const session = req.session['v_session'];

        //
        if (token != session) {
            return res.send({
                rc: "03",
                rd: "You must be login!."
            });
        }

        //
        if (req.session['v_merchant'] === undefined || req.session['v_merchant'] === null) {

            return res.send({
                rc: "03",
                rd: "Merchant isn't found, Please Input yurr merchant!."
            });

        }

        return res.send({
            rc: '00',
            rd: "success",
        });

    } catch (error) {
        logger.error(`Error /app/account: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});

Router.post('/app/account', async function(req, res) {
    const {
        token
    } = req.body;
    logger.info(`Request /app/account: ${JSON.stringify(req.body)}`);

    try {
        const {
            data
        } = await axios.post(`${process.env.URL_HIT}/app/account`, {
            token: token,
        });

        logger.info(`Response /app/account: ${JSON.stringify(data)}`);
        return res.send(data);
    } catch (error) {
        logger.error(`Error /app/account: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});

Router.post('/app/history_idpel', async function(req, res) {
    const {
        token,
        type
    } = req.body;
    try {

        const username = req.session['v_uname'];
        const merchant = req.session['v_merchant'] === "" || req.session['v_merchant'] === undefined || req.session['v_merchant'] === null ? "" : req.session['v_merchant'];
        const jwtDecodedResponse = await jwtDecoded(token);

        if (jwtDecodedResponse == undefined || jwtDecodedResponse == null || jwtDecodedResponse?.trim() == '') {
            return res.send({
                rc: '03',
                rd: 'gagal!'
            });
        }

        const splitUidPin = jwtDecodedResponse.split('|');
        const uid = splitUidPin[0];
        const pin = splitUidPin[1];

        logger.info(`Request /app/history_idpel: ${JSON.stringify({
      method:"history_idpel",
      uid:uid,
      pin:'-----',
      produk:type,
      username:username
    })}`);

        const {
            data
        } = await axios.post(`https://api.rajabiller.com/transaksi/api_json.php`, {
            method: "history_idpel",
            uid: uid,
            pin: pin,
            produk: type,
            username: username,
            merchant:merchant
        });

        logger.info(`Response /app/history_idpel: ${JSON.stringify(data)}`);
        return res.send(data);

    } catch (error) {
        logger.error(`Error /app/history_idpel: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});



Router.post('/refresh-date', async function(req, res) {
    const {
        token
    } = req.body;
    logger.info(`Request /refresh-date: ${JSON.stringify(req.body)}`);

    try {

        const verifyToken = req.session['v_session'];
        const expired = req.session['expired_session'];

        if (verifyToken == null || verifyToken == undefined) {
            return res.send({
                rc: '03',
                rd: 'Anda harus login terlebih dahulu.'
            });
        }

        if (token == null || token == undefined) {
            return res.send({
                rc: '03',
                rd: 'Anda harus login terlebih dahulu.'
            });
        }

        if (expired == null || expired == undefined) {
            return res.send({
                rc: '03',
                rd: 'EXpired Date is Expired.'
            });
        }

        if (token == verifyToken) {

            return res.send({
                data: {
                    rc: '00',
                    rd: 'success',
                    data: {
                        expired_date: expired
                    }
                }
            });

        } else {
            return res.send({
                rc: '03',
                rd: 'Expired date tidak ditemukan.'
            });

        }

    } catch (error) {
        logger.error(`Error /refresh-date: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});


Router.post('/app/sign_out', async function(req, res) {
    const {
        token
    } = req.body;
    const data = req.body;
    logger.info(`Request /app/sign_out: ${JSON.stringify(data)}`);

    try {
        const {
            data
        } = await axios.post(`${process.env.URL_HIT}/app/sign_out`, {
            token: token,
        });

        req.session.destroy()

        logger.info(`Response /app/sign_out: ${JSON.stringify(data)}`);
        return res.send(data);
    } catch (error) {
        logger.error(`Error /app/sign_out: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });
    }
});


Router.get('/country', (req, res) => {

    return res.status(200).json(country);

});

Router.post('/app/transaction_list', async function(req, res) {

    try {

        const {
            token,
            product
        } = req.body;
        logger.info(`Request /app/transaction_list: ${JSON.stringify(req.body)}`);

        const requests = {};
        requests['username'] = req.session['v_uname'];
        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /app/transaction_list [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            requests['username'] = requests['username'] + '#' + merchart;
        }

        const {
            data
        } = await axios.post(`${process.env.URL_HIT}/app/transaction_list`, {
            token: token,
            product: product,
            ...requests
        });

        logger.info(`Response /app/transaction_list: ${JSON.stringify(data)}`);
        return res.send(data);
    } catch (error) {
        logger.error(`Error /app/transaction_list: ${error.message}`);
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});


Router.post('/app/transaction_book_list', async function(req, res) {

    try {

        const {
            token,
            product,
            startDate,
            endDate
        } = req.body;
        const requests = {};

        requests['username'] = req.session['v_uname'];
        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        logger.info(`Request /app/transaction_book_list [USERNAME] : ${username} [MERCHANT IF EXISTS]: ${merchart}`);

        if (merchart !== undefined && merchart !== null) {

            requests['username'] = requests['username'] + '#' + merchart;
        }

        logger.info(`Request /app/transaction_book_list: ${JSON.stringify({
        token: token,
        product: product,
        startDate,
        endDate,
        ...requests
      })}`);

        const {
            data
        } = await axios.post(`${process.env.URL_HIT}/app/transaction_book_list`, {
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
        return res.status(200).send({
            rc: '68',
            rd: 'Internal Server Error.'
        });

    }
});


Router.post('/app/transaction_book_list/all', async (req, res) => {
    try {
        const { token, jenis } = req.body;

        if (!token) {
            return res.status(400).json({
                rc: '01',
                rd: 'Invalid request parameters. Token, startDate, and endDate are required.',
            });
        }

        const merchart = req.session['v_merchant'];
        const username = req.session['v_uname'];

        let formattedUsername = username;
        if (merchart) {
            formattedUsername += `#${merchart}`;
        }

        const urls =  `${process.env.URL_HIT}/app/${jenis === 'transaksi' ? 'transaction_list' : 'transaction_book_list'}`;
        const products = ['PESAWAT','KERETA','KAPAL'];

        logger.info(`Request /app/transaction_book_list/all from [USERNAME]: ${req.session['v_uname']}, [MERCHANT]: ${req.session['v_merchant']}`);

        const [pesawat, kereta, pelni] = await Promise.all(
            products.map(product => axios.post(urls, { token, product:product, username: formattedUsername }).then(response => response.data).catch(error => {
                logger.error(`Error fetching data from ${urls}: ${error.message}`);
                return null; 
            }))
        );

        const responseData = {
            kereta: kereta || {},
            pesawat: pesawat || {},
            pelni: pelni || {},
            rc: '00',
            rd: 'Success.',
        };

        logger.info(`Response /app/transaction_book_list/all: ${JSON.stringify(responseData)}`);

        return res.status(200).json(responseData);
    } catch (error) {
        logger.error(`Unexpected Error /app/transaction_book_list/all: ${error.message}`);
        return res.status(500).json({
            rc: '68',
            rd: 'Internal Server Error.',
        });
    }
});

Router.post('/is_whitelist', async function(req, res) {

    const idoutlet = req.session['id_outlet'] || '';
    const data = req.body
    const isProd = await WhitelistDevelByIdOutlet(idoutlet, data.produk || '');

    if (isProd) {

        return res.status(200).json({
            rc: '00',
            rd: 'success',
            is_simulate: 0
        })

    }

    return res.status(200).json({
        rc: '00',
        rd: 'success',
        is_simulate: 1
    })


});


Router.get('/is_type', async function(req, res) {

    const types = req.session['type'];

    if (!types) {

        return res.status(401).json({
            rc: '04',
            rd: 'expired!',
            type: 'auth'
        })

    }

    return res.status(200).json({
        rc: '00',
        rd: 'success',
        type: types
    })


});

module.exports = Router; //