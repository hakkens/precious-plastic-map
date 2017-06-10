var webpack = require('webpack');
var Merge = require('webpack-merge');
var CommonConfig = require('./webpack.common.js');

var mergedConfig = function(env) {
  return Merge(CommonConfig, {
    devtool: "#inline-source-maps",
    plugins: [
      new webpack.DefinePlugin({
        'process.env' : {
          'WP_URL': JSON.stringify('http://187.217.174.169/ppWP')
        }
      })
    ]
  });
};

module.exports = mergedConfig();
