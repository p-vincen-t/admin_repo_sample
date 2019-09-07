const { join } = require('path');
const { Index, Auth, About, AllPages } = require("../controllers");
const { isAuthenticated } = require('../middleware')
const authRoutes = require('./auth')
// seting the main app routes
module.exports = server => {

  authRoutes(server);

  server.get("/", isAuthenticated(true), Index);

  server.get("/n", isAuthenticated(true), Index);

  server.get("/about", isAuthenticated(false), About);

  server.get("/auth", isAuthenticated(false), Auth);

  server.get('/service-worker.js', (_, res) =>
    res.sendFile(join('.next', '/service-worker.js'), { root: '.' }),
  );

  server.get("*", AllPages);

};
