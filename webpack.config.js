/* globals require, __dirname, module */

const
  path = require('path'),
  webpack = require('webpack');

const config = {
  entry: './src/index.js',
//  mode: 'development',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'docs/build/'),
    filename: 'rmr-popover.bundle.js'
  },
  watch : true,
  plugins : [
  ],
  module : {
    rules : [
    ]
  }
};

module.exports = config;
