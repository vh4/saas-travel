const express = require('express');
const cors = require('cors');
require('dotenv').config();

//router
const MainRoutes = require('./routes/main');
const PelniRouter = require('./routes/pelni');
const KeretaRouter = require('./routes/kereta');
const PesawatRouter = require('./routes/pesawat');

const logger = require('./utils/logger.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 9999;

// Use cookie-parser middleware
app.use(cookieParser());

// Configure express-session
app.use(session({
  secret: 'bimasakithebestforever@secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000,
    secure:false
  },
}));

const url = process.env.FRONTEND_URL_OR_IP_ACCESS_CORS;
logger.info(`.env production is alive. url hit frontend: ${url}`);

app.use(cors({
  origin:["http://localhost:3000", "http://10.0.9.88:3000", "http://10.0.9.88:1111", "http://localhost:1111", url],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json());

app.use(MainRoutes);
app.use(PelniRouter);
app.use(KeretaRouter);
app.use(PesawatRouter);

app.listen(port, () => {
  logger.info("server listening on port " + port);
});
