const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');

const workspaceRoot = path.join(__dirname, './');

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
      const plugins = config.plugins.concat([
        new webpack.DefinePlugin({
          'process.env': {
            VERSION: JSON.stringify(pkg.version),
            ENABLE_AD: JSON.stringify(process.env.ENABLE_AD),
          },
        }),
      ]);
      if (process.env.DOCS_STATS_ENABLED) {
        plugins.push(
          // For all options see https://github.com/th0r/webpack-bundle-analyzer#as-plugin
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            generateStatsFile: true,
            // Will be available at `.next/stats.json`
            statsFilename: 'stats.json',
          }),
        );
      }
       // next includes node_modules in webpack externals. Some of those have dependencies
    // on the aliases defined above. If a module is an external those aliases won't be used.
    // We need tell webpack to not consider those packages as externals.
    if (options.isServer) {
      const [nextExternals, ...externals] = config.externals;

      if (externals.length > 0) {
        // currently not the case but other next plugins might introduce additional
        // rules for externals. We would need to handle those in the callback
        throw new Error('There are other externals in the webpack config.');
      }

      config.externals = [
        (context, request, callback) => {
          const hasDependencyOnRepoPackages = [
            'notistack',
            'material-table',
            '@material-ui/pickers',
          ].includes(request);

          if (hasDependencyOnRepoPackages) {
            return callback(null);
          }
          return nextExternals(context, request, callback);
        },
      ];
    }
    return Object.assign({}, config, {
      plugins,
      node: {
        fs: 'empty',
      },
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.(css|md)$/,
            loader: 'emit-file-loader',
            options: {
              name: 'dist/[path][name].[ext]',
            },
          },
          {
            test: /\.(css|md)$/,
            loader: 'raw-loader',
          },
          // transpile 3rd party packages with dependencies in this repository
          {
            test: /\.(js|mjs|jsx)$/,
            include: /node_modules(\/|\\)(material-table|notistack|@material-ui(\/|\\)pickers)/,
            use: {
              loader: 'babel-loader',
              options: {
                // on the server we use the transpiled commonJS build, on client ES6 modules
                // babel needs to figure out in what context to parse the file
                sourceType: 'unambiguous',
                plugins: [
                  [
                    'babel-plugin-module-resolver',
                    {
                      alias: {
                        'app': './',
                      },
                      transformFunctions: ['require'],
                    },
                  ],
                ],
              },
            },
          },
          // required to transpile ../packages/
          {
            test: /\.(js|mjs|jsx)$/,
            include: [workspaceRoot],
            exclude: /node_modules/,
            use: options.defaultLoaders.babel,
          },
        ]),
      }),
    });
    },
    exportTrailingSlash: true,
    serverRuntimeConfig: {
      // Will only be available on the server side
      mySecret: "secret"
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      API_URL: process.env.API_URL
    },

    onDemandEntries: {
      // Period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 120 * 1e3, // default 25s
      // Number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 3, // default 2
    },
  }
);
