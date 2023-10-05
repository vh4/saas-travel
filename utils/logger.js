const pino = require("pino");
const pinoPretty = require("pino-pretty");

const prettyStream = pinoPretty();
const prettyLogger = pino({}, prettyStream);

const logger = {
  info: (message) => {
    prettyLogger.info(message);
  },

  error: (message) => {
    prettyLogger.error(message);
  },
};

module.exports = logger; //update logger
