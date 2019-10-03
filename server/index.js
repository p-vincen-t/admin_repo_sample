"use-strict";
require("dotenv").config();
const Sentry = require("@sentry/node");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const next = require("next");
const setRoutes = require("./routes");
const { csrf } = require("./middleware");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const { logError, fatal, logInfo } = require("../common/logger");
const { addTeardown } = require("../common/killSignals");

// Uncaught promise bubbling up to the global scope.
process.on("unhandledRejection", (reason, promise) => {
  fatal({
    name: "unhandledRejection",
    msg: { reason, promise }
  });
});

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logError("permission error: ", bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logError("server error: ", bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

(async (app, onError) => {
  addTeardown({
    callback: () => app.close(),
    order: 1
  });
  try {
    await app.prepare();
    const server = express();
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    server.use(Sentry.Handlers.requestHandler());
    server.use(require("helmet")());
    server.use(require("morgan")("dev"));
    server.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 200
      })
    );
    server.use(express.static('../static'))
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    // server.use(cookieParser());
    server.use((req, _, next) => {
      req.app = app;
      next();
    });
    setRoutes(server);
    server.use(csrf);
    server.use(Sentry.Handlers.errorHandler());
    // Optional fallthrough error handler
    server.use((err, _req, res, _next) => {
      logError("server middleware error: ", err);
      res.status(500).send({
        error: err
      });
    });
    server.on("error", onError);
    server.listen(port, () => {
      logInfo("Listening on " + port);
    });
    addTeardown({
      callback: () => {
        logError("http", "server is stopping");
        return new Promise((resolve, reject) => {
          server.close(err => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      },
      order: 2
    });
  } catch (e) {
    onError(e);
  }
})(next({ dev }), onError);
