var webpack = require('webpack');
var Merge = require('webpack-merge');
var CommonConfig = require('./webpack.common.js');

var mergedConfig = function(env) {
  return Merge(CommonConfig, {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        ie8: true,
        beautify: false,
        mangle: {
          keep_fnames: true
        },
        comments: false
      }),
      new webpack.DefinePlugin({
        'process.env' : {
          'WP_URL': JSON.stringify('https://davehakkens.nl')
        }
      })
    ]
  });
};

module.exports = mergedConfig();
