var webpack = require('webpack');
var Merge = require('webpack-merge');
var CommonConfig = require('./webpack.common.js');

var mergedConfig = function(env) {
  return Merge(CommonConfig, {
    devtool: "#inline-source-maps"
  });
};

module.exports = mergedConfig();
