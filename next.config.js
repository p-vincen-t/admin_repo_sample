const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const webpack = require('webpack');
const path = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');


// const workspaceRoot = path.join(__dirname, './');

// const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

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
    webpack: (config, options) => {

      // if (config.resolve.plugins) {
      //   config.resolve.plugins(new TsconfigPathsPlugin());
      // }
      // else {
      //   config.resolve.plugins = [new TsconfigPathsPlugin()];
      // }
      const plugins = config.plugins.concat([
        new webpack.DefinePlugin({
          'process.env': {
            VERSION: JSON.stringify(pkg.version),
            ENABLE_AD: JSON.stringify(process.env.ENABLE_AD),
          },
        }),
      ]);

      const alias = config.resolve.alias
      alias['common'] = path.join(__dirname, 'common')
      alias['layout'] = path.join(__dirname, 'components/layout')
      alias['contexts'] = path.join(__dirname, 'lib/contexts')
      alias['models'] = path.join(__dirname, 'lib/models')
      alias['appRedux'] = path.join(__dirname, 'lib/redux')
      alias['stores'] = path.join(__dirname, 'lib/base/pref')
      alias['services'] = path.join(__dirname, 'lib/services')
      alias['utils'] = path.join(__dirname, 'lib/utils')
      alias['lib'] = path.join(__dirname, 'lib')
      alias['pages'] = path.join(__dirname, 'pages')

      return Object.assign({}, config, {
        // plugins,
        node: {
          fs: 'empty',
        },
        resolve: Object.assign({}, config.resolve, {
          alias
        })
      });
    },
    exportTrailingSlash: true,
    serverRuntimeConfig: {
      // Will only be available on the server side
      mySecret: "secret"
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      VERSION: JSON.stringify(pkg.version),
    },

    onDemandEntries: {
      // Period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 120 * 1e3, // default 25s
      // Number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 3, // default 2
    },
  }
);
