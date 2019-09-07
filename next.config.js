const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withFonts = require("next-fonts");
const withImages = require("next-images");

module.exports = withPlugins(
  [
    [
      withCSS,
      {
        cssModules: true,
        cssLoaderOptions: {
          localIdentName: "[path]___[local]___[hash:base64:5]"
        }
      }
    ],
    [withFonts],
    [withImages]
  ],
  {
    distDir: "build",
    webpack: (config, _) => {
      config.node = {
        fs: "empty"
      };
      return config;
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      mySecret: "secret"
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      API_URL: process.env.API_URL
    }
  }
);
