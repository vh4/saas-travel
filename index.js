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

app.use(cors());

app.use(express.json());

app.use(MainRoutes);
app.use(PelniRouter);
app.use(KeretaRouter);
app.use(PesawatRouter);
app.get('*', (req, res) => {
  return res.status(404).json({
    rc:'04',
    rd:'HTTP/1.1 404 Not Found.'
  })
})

app.listen(port, () => {
  logger.info("server listening on port " + port);
});
