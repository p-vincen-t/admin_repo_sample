const winston = require('winston')
const { createLogger, format, transports } = winston;
const { combine, label, printf } = format;

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.align(),
  winston.format.printf((info) => {
    const {
      level, message, ...args
    } = info;
    return `[${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
);

const logger = createLogger({
  levels: winston.config.syslog.levels,
  format: alignedWithColorsAndTime,
  transports: [
    // //
    // // - Write to all logs with level `info` and below to `combined.log`
    // // - Write all logs error (and below) to `error.log`.
    // //
    // new transports.File({ filename: "error.log", level: "error" }),
    // new transports.File({ filename: "combined.log" })
  ],
  // exceptionHandlers: [
  //   new winston.transports.File({ filename: 'exceptions.log' })
  // ]
});

logger.exitOnError = false;

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
      prettyPrint: object => JSON.stringify(object),
      handleExceptions: true,
      json: true,
      colorize: true
    })
  );
}


exports.logError = (message, ...meta) => logger.error(message, ...meta);
exports.logInfo = (message, ...meta) => logger.info(message, ...meta);
exports.logWarning = (message, ...meta) => logger.warn(message, ...meta);
exports.logVerbose = (message, ...meta) => logger.verbose(message, ...meta);
