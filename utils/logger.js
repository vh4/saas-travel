const pino = require("pino");
const pinoPretty = require("pino-pretty");
const winston = require("winston");
const path = require("path");
// const fs = require("fs");

const prettyStream = pinoPretty();
const prettyLogger = pino({}, prettyStream);

// const logDirectory = path.join(__dirname, "../logs");
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

// const logFilePath = path.join(logDirectory, `logger-${getCurrentDate()}.txt`);

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
});

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const logger = {
  info: (message) => {
    prettyLogger.info(message);
    winstonLogger.info(message);
  },

  error: (message) => {
    prettyLogger.error(message);
    winstonLogger.error(message);
  },
};

module.exports = logger;
