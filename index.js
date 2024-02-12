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

app.use(cors({
  origin:["*", "http://10.9.43.5:9004", "http://10.9.43.5:9003", "http://localhost:3000", 
  "http://localhost:1111", url, "http://10.9.43.5:1111", "http://10.9.43.5:3000", 
  "http://10.9.43.5:9004", "https://travel.rajabiller.com", "http://10.9.43.5"],
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}));
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
