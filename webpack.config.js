const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require('path');
const webpack = require('webpack');

const distDirectory = path.resolve(__dirname, 'dist');
const extractLess = new ExtractTextPlugin({filename: "filechunk.css"});

module.exports = {
  entry: ['./src/index.js'],
  //devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin([distDirectory]),
    new MinifyPlugin(),
    extractLess
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }, {
        loader: "ts-loader"
      }],
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }]
    },{
      test: /\.less$/,
      use: extractLess.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader"
        },{
          loader: "less-loader"
        }]
      })
    }]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: 'filechunk.js',
    path: distDirectory
  }
};
