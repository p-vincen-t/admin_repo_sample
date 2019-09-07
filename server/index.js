"use-strict";
require("dotenv").config();
const Sentry = require("@sentry/node");
// const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const next = require("next");
const setRoutes = require("./routes");
const { csrf } = require("./middleware");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const { logError } = require("../common/logger");

const onError = error => {
  logError("error booting app: ", error);
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

(async (app, onError) => {
  try {
    await app.prepare();
    const server = express();
    // Sentry.init({ dsn: process.env.SENTRY_DSN });
    // server.use(Sentry.Handlers.requestHandler());
    server.use(require("helmet")());
    // server.use(compression());
    server.use(require("morgan")("dev"));
    server.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 200
      })
    );
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    // server.use(cookieParser());
    server.use((req, _, next) => {
      req.app = app;
      next();
    });
    setRoutes(server);
    server.use(csrf);
    // server.use(Sentry.Handlers.errorHandler());
    // Optional fallthrough error handler
    server.use((err, _req, res, _next) => {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      logError("server route error: ", err);
      res.status(500).send({
        error: err
      });
      // res.statusCode = 500;
      // res.end(res.sentry + "\n");
    });
    const onListening = () => {
      console.log("Listening on " + port);
    };
    server.on("error", onError);
    // server.on("listening", onListening);
    server.listen(port, onListening);
  } catch (e) {
    onError(e);
  }
})(next({ dev }), onError);
