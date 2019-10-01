const bpmr = require('babel-plugin-module-resolver');

function resolvePath(sourcePath, currentFile, opts) {
  if (sourcePath === 'markdown') {
    const base = currentFile.substring(__dirname.length).slice(0, -3);
    return `${__dirname}/${base}/`;
  }

  return bpmr.resolvePath(sourcePath, currentFile, opts);
}

const alias = {
  common: './common',
  layout: './components/layout',
  contexts: './lib/contexts',
  models: './lib/models',
  appRedux: './lib/redux',
  services: './lib/services',
  stores: './lib/base/pref',
  utils: './lib/utils',
  lib: './lib',
  pages: './pages'
};

module.exports = {
  presets: ['next/babel', '@zeit/next-typescript/babel'],
  plugins: [
    'babel-plugin-optimize-clsx',
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
    'babel-plugin-preval',
    [
      'module-resolver',
      {
        alias,
        // transformFunctions: ['require', 'require.context'],
        resolvePath,
      },
    ],
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  env: {
    production: {
      plugins: [
        'babel-plugin-transform-react-constant-elements',
        'babel-plugin-transform-dev-warning',
        ['babel-plugin-react-remove-properties', { properties: ['data-mui-test'] }],
        ['babel-plugin-transform-react-remove-prop-types', { mode: 'remove' }],
      ],
    },
  },
};
