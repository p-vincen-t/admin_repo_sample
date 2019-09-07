const passport = require("passport");
const { Strategy } = require("passport-custom");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient();
const redisStore = require("connect-redis")(session);
const { logError, logInfo } = require("../../common/logger");
const Request = require("../common");
// registeres an error callback for redis store
redisClient.on("error", err => {
  logError("Redis error: ", err);
});

// verifies the token to get back a user
const verifyToken = (token, cb) =>
  Request.get("auth/login/verify", {
    headers: { authorization: `Bearer ${token}` }
  }).then(
    ({ data }) => {
      cb(null, data);
    },
    err => {
      logError("server verify token error: ", err);
      cb(err);
    }
  );

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(
  "with_device",
  new Strategy((req, cb) => {
    console.log(req.body);
    const { identifier, password, deviceId } = req.body;
    Request.post("auth/login", { identifier, password, deviceId })
      .then(({ data: { token, refresh_token } }) =>
        verifyToken(token, (err, user) => {
          if (err) return cb(err);
          cb(null, { user, token, refresh_token });
        })
      )
      .catch(err => {
        cb(null, false, err);
      });
  })
);

passport.serializeUser(({ token }, cb) => cb(null, token));

passport.deserializeUser((token, cb) => {
  verifyToken(token, (err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
});

module.exports = server => {
  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.

  server.use(
    session({
      secret: "1576",
      name: "tid",
      resave: false,
      saveUninitialized: false,
      // cookie: { secure: false },
      store: new redisStore({
        host: "localhost",
        port: 6379,
        client: redisClient,
        ttl: 86400
      })
    })
  );

  server.use(passport.initialize());

  server.use(passport.session());

  server.post("/auth/login", (req, res, next) => {
    passport.authenticate("with_device", (err, user, info) => {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        const { status, data } = info;
        return res.status(status).send(data);
      }
      // ***********************************************************************
      // "Note that when using a custom callback, it becomes the application's
      // responsibility to establish a session (by calling req.login()) and send
      // a response."
      // Source: http://passportjs.org/docs
      // ***********************************************************************

      req.login(user, err => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  server.post("/auth/login/verify", (req, res, next) => {});

  server.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
};
