const pino = require("pino");
const pinoPretty = require("pino-pretty");
const winston = require("winston");
const path = require("path");

const prettyStream = pinoPretty();
const prettyLogger = pino({}, prettyStream);

const logFilePath = path.join(__dirname, "../logs", "logger.txt");

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: logFilePath,
      level: "info",
    }),
  ],
});

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
