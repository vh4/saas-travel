const fs = require('fs');
const logger = require('./logger');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    getIdOutlet:async function(token){

        const response = await fetch(`${process.env.URL_HIT}/travel/app/account`, {
            method: 'post',
            body: JSON.stringify({token:token}),
            headers: {'Content-Type': 'application/json'}
        });
    
        const data = await response.json();
        return data.data.idOutlet;
    },

    getCountry: function(){
        const data = JSON.parse(fs.readFileSync(__dirname + '/country.json', 'utf8'));
        logger.info(`Country readed!...`)
        return data;
    }
};