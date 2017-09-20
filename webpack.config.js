/*jshint esnext:true */
/* globals require, __dirname, module */


const
    path = require('path');
//    webpack = require('webpack');

//const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const extractCSS = new ExtractTextPlugin('[name].bundle.css');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'popover.bundle.js'
  },
  module : {
    rules : [
/*
    { test: /\.scss$/, use: [
      { loader: "style-loader" }, // creates style nodes from JS strings
      { loader: "css-loader" }, // translates CSS into CommonJS
      { loader: "sass-loader" } // compiles Sass to CSS
    ]},
*/
    {
      test : /\.js$/,
      include : path.resolve(__dirname, 'src'),
      use : [{
        loader: 'babel-loader',
        options : {
          presets : [
            ['es2015', { modules : false }]
          ]
        }
      }]
    }
    
    
    ]
  }
};

module.exports = config;
