const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const requestIp = require('request-ip');
require('dotenv').config();

//router
const MainRoutes = require('./routes/main');
const PelniRouter = require('./routes/pelni');
const KeretaRouter = require('./routes/kereta');
const PesawatRouter = require('./routes/pesawat');

const logger = require('./utils/logger.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { getInfoClientAll } = require('./utils/utils');

const app = express();

// CORS Middleware to allow all origins
const allowAllCorsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // Check if pre-flight request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Apply the CORS middleware
app.use(allowAllCorsMiddleware);


const port = 9999;

// Use cookie-parser middleware
app.use(cookieParser());
app.use(useragent.express());
app.use(requestIp.mw())

// Configure express-session
app.use(session({
  secret: 'bimasakithebestforever@secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: parseInt(process.env.EXPIRED_SESSION_SERVER) || 262900000, // 3 hari 2 jam.
    secure:false
  },
}));

const url = process.env.FRONTEND_URL_OR_IP_ACCESS_CORS;
logger.info(`.env production is alive. url hit frontend: ${url}`);


app.use(express.json());

app.use('/travel', MainRoutes);
app.use('/travel', PelniRouter);
app.use('/travel', KeretaRouter);
app.use('/travel', PesawatRouter);
app.get('/whoareyou', (req, res) => {

  return res.json(getInfoClientAll(req));
});

app.get('*', (req, res) => {
  return res.status(404).json({
    rc:'04',
    rd:'HTTP/1.1 404 Not Found.'
  })
})


app.listen(port, () => {
  logger.info("server listening on port " + port);
});
