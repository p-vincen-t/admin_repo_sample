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

/* eslint-disable no-console */

// https://github.com/trentm/node-bunyan#levels
const logTypes = {
  // Detail on regular operation.
  info: { level: 3, method: 'log' },
  // A note on something that should probably be looked at by an operator eventually.
  warn: { level: 4, method: 'warn' },
  // Fatal for a particular request, but the service/app continues servicing other requests.
  // An operator should look at this soon(ish).
  error: { level: 5, method: 'error' },
  // The service/app is going to stop or become unusable now.
  // An operator should definitely look into this soon.
  fatal: { level: 6, method: 'error' },
};

function serializeErr(msg) {
  if (!msg.err.stack) {
    return msg.err;
  }

  return {
    ...msg,
    err: {
      message: msg.err.message,
      name: msg.err.name,
    },
  };
}

function serializeDuration(msg) {
  return {
    ...msg,
    duration: `${msg.duration.toFixed(2)}ms`,
  };
}

function safeCycles() {
  const seen = new Set();
  return function handleKey(key, val) {
    if (!val || typeof val !== 'object') {
      return val;
    }
    if (seen.has(val)) {
      return '[Circular]';
    }
    seen.add(val);
    return val;
  };
}

/**
 * A fast JSON.stringify that handles cycles and getter exceptions (when
 * safeJsonStringify is installed).
 *
 * This function attempts to use the regular JSON.stringify for speed, but on
 * error (e.g. JSON cycle detection exception) it falls back to safe stringify
 * handlers that can deal with cycles and/or getter exceptions.
 *
 * From: https://github.com/trentm/node-bunyan/blob/c0932196dd6846189ec82623c12d051eee799d4f/lib/bunyan.js#L1208
 */
function fastAndSafeJsonStringify(object) {
  try {
    return JSON.stringify(object);
  } catch (err) {
    try {
      return JSON.stringify(object, safeCycles());
    } catch (err2) {
      console.log('err', err);
      console.log('err2', err2);
      console.log('object', object);
      return 'modules/scripts/log: something is wrong';
    }
  }
}

function logMethod(process, console, type) {
  return object => {
    const { name, msg, force = false } = object;
    let formatedMsg = msg;

    if (process.env.NODE_ENV === 'test' && !force) {
      return;
    }

    if (process.env.NODE_ENV !== 'production' && !name) {
      throw new Error(`Missing name ${JSON.stringify(object)}`);
    }

    const format =
      process.env.NODE_ENV === 'production' &&
      process.env.LOG_FORMAT !== 'human' &&
      !process.browser
        ? 'json'
        : 'human';

    if (formatedMsg.duration) {
      formatedMsg = serializeDuration(formatedMsg);
    }

    if (format === 'json') {
      if (formatedMsg.err) {
        formatedMsg = serializeErr(formatedMsg);
      }

      const message = fastAndSafeJsonStringify({
        level: logTypes[type].level,
        msg: formatedMsg,
        name,
        ...(process.browser ? {} : { pid: process.pid }),
      });

      if (process.browser) {
        console[logTypes[type].method](message);
        return;
      }

      // Faster than calling console.x.
      process.stdout.write(`${message}\n`);
    } else {
      const messages = [];

      if (process.browser) {
        messages.push(`${name}:`);
      } else {
        messages.push(`${type.toUpperCase()} ${process.pid} ${name}:`);
      }

      if (formatedMsg.err) {
        messages.push(formatedMsg.err);
        delete formatedMsg.err;
      }
      messages.push(formatedMsg);

      console[logTypes[type].method](...messages);
    }
  };
}

const log = {
  info: logMethod(process, console, 'info'),
  warn: logMethod(process, console, 'warn'),
  error: logMethod(process, console, 'error'),
  fatal: logMethod(process, console, 'fatal'),
};

exports = log;
