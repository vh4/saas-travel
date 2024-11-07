const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const requestIp = require('request-ip');
require('dotenv').config();
var timeout = require('connect-timeout');

//router
const MainRoutes = require('./routes/main');
const PelniRouter = require('./routes/pelni');
const KeretaRouter = require('./routes/kereta');
const PesawatRouter = require('./routes/pesawat');
const DLURouter = require('./routes/dlu');

const logger = require('./utils/logger.js');
const cookieParser = require('cookie-parser'); //
const session = require('express-session');
const {
    getInfoClientAll
} = require('./utils/utils');
const axios = require('axios')
const {
    dbCheck
} = require('./databases/db')

const app = express();
const port = 9999;
app.use(timeout('3600s'))
//for checked databases.
dbCheck();

// Use cookie-parser middleware
app.use(cookieParser());
app.use(useragent.express());
app.use(requestIp.mw())

// Configure express-session dd
app.use(session({
    secret: 'bimasakithebestforever@secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: parseInt(process.env.EXPIRED_SESSION_SERVER) || 604800000, // 3 hari 2 jam.
        secure: false
    },
}));

const url = process.env.FRONTEND_URL_OR_IP_ACCESS_CORS;
logger.info(`.env production is alive. url hit frontend: ${url}`);

app.use(cors({
    origin: ["http://localhost:3000", "http://10.0.9.88:3000", "http://10.0.9.88:1111", "http://localhost:1111", url],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

app.use(express.json());
app.use('/travel', MainRoutes);
app.use('/travel', PelniRouter);
app.use('/travel', KeretaRouter);
app.use('/travel', PesawatRouter);
app.use('/travel', DLURouter);

app.get('/travel/holidays', async (req, res) => {
    try {
        const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/id.indonesian.official%23holiday%40group.v.calendar.google.com/events', {
            params: {
                key: 'AIzaSyDvmiGaeS47xTleSsWyLX3APlDUUOF5igQ',
                ctz: 'Asia%2FJakarta'
            }, //
        });

        const holidays = response.data.items.map(item => ({
            start: item.start.date, 
            summary: item.summary,
        }));

        res.json(holidays);

    } catch (error) {
        console.error(error);
        res.status(500).json([]);
    }
});


app.get('/whoareyou', (req, res) => {

    return res.json(getInfoClientAll(req));
});

app.get('*', (req, res) => {
    return res.status(404).json({
        rc: '04',
        rd: 'HTTP/1.1 404 Not Found.'
    })
})

app.listen(port, () => {
    logger.info("server listening on port " + port);
});