const { EncryptDecrypt } = require("../../common/crypt");
const passport = require("passport");
const { Strategy } = require("passport-custom");
const session = require("express-session");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const { logError, logInfo } = require("../../common/logger");
const Request = require("../common");
const redisClient = redis.createClient();

redisClient.on("connect", () => {
  logInfo("Redis: connected to client");
});

// registeres an error callback for redis store
redisClient.on("error", err => {
  logError("Redis: " + err);
});

// verifies the token to get back a user
// provided the token check if their is user info in the redis store
// if absent, check user from api and store in client
// then respond with user infor
const verifyToken = (token, cb) => {
  // check if user exists
  redisClient.hget(process.env.SESSION_SECRET_KEY, token, (_, setUser) => {
    if (setUser) return cb(null, setUser);
    // user does not exist, fetch from api
    Request.get("auth/login/verify", {
      headers: { authorization: `Bearer ${token}` }
    }).then(
      ({ data }) => {
       // store the user in redis store and return user
        redisClient.hset(
          process.env.SESSION_SECRET_KEY,
          token,
          JSON.stringify(data),
          (err, _) => {
            if (err) return cb(err);
            cb(null, data);
          }
        );
      },
      err => {
        logError("server verify token error: ", err);
        cb(err);
      }
    );
  });
};

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(
  "with_device",
  new Strategy((req, cb) => {
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
      secret: process.env.SESSION_SECRET_KEY,
      name: process.env.SESSION_COOKIE_NAME,
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
    passport.authenticate("with_device", (err, userInfo, info) => {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!userInfo) {
        const { status, data } = info;
        return res.status(status).send(data);
      }
      // ***********************************************************************
      // "Note that when using a custom callback, it becomes the application's
      // responsibility to establish a session (by calling req.login()) and send
      // a response."
      // Source: http://passportjs.org/docs
      // ***********************************************************************

      const { user, token, refresh_token } = userInfo;
      // store the user in redis store and login
      redisClient.hset(
        process.env.SESSION_SECRET_KEY,
        token,
        JSON.stringify(user),
        (err, _) => {
          if (err) return next(err);
          req.login(userInfo, err => {
            if (err) return next(err);
            res.status(200).json({ user: token, refresh_token });
          });
        }
      );
    })(req, res, next);
  });

  // when loggin out, delete the user from the store and end the session
  server.get("/logout", function(req, res, next) {
    if (req.session) {
      const { user } = req.query;
      redisClient.hdel(process.env.SESSION_SECRET_KEY, user, (err, deleted) => {
        if (err) return next(err);
        if (deleted)
          req.session.destroy(err => {
            if (err) {
              return next(err);
            } else {
              return res.redirect("/auth");
            }
          });
      });
      // delete session object

    } else next(new Error("a session was not found"));
    // req.logout();
    // res.redirect("/auth");
  });

  server.get("/auth/verify", (req, res, next) => {
    const { user } = req.query;
    redisClient.hget(process.env.SESSION_SECRET_KEY, user, (err, setUser) => {
      if (err) return next(err);
      if (setUser) return res.status(200).send(setUser);
      verifyToken(token, (e, data) => {
        if (e) return next(e);
        return res.status(200).send(data);
      });
    });
  });
};
