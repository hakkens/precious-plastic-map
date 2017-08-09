var webpack = require('webpack');
var Merge = require('webpack-merge');
var CommonConfig = require('./webpack.common.js');

var mergedConfig = function(env) {
  return Merge(CommonConfig, {
    devtool: "#inline-source-maps",
    plugins: [
      new webpack.DefinePlugin({
        'process.env' : {
          'WP_URL': JSON.stringify('http://localhost:8000'),
          'WP_LOGIN': JSON.stringify('http://localhost:8000/community/login?redirect_to=')
        }
      })
    ]
  });
};

module.exports = mergedConfig();
