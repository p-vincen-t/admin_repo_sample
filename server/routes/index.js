const { join } = require('path');
const { Index, Auth, About, AllPages } = require("../controllers");
const { isAuthenticated } = require('../middleware')
const authRoutes = require('./auth')
// seting the main app routes
module.exports = server => {

  const robotsOptions = {
    root: __dirname + '/static/',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    }
  };
  server.get('/robots.txt', (req, res) => (
    res.status(200).sendFile('robots.txt', robotsOptions)
  ));
  
  const sitemapOptions = {
    root: __dirname + '/static/',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
    }
  };
  server.get('/sitemap.xml', (req, res) => (
    res.status(200).sendFile('sitemap.xml', sitemapOptions)
  ));

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
