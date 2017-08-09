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
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      }),
      new webpack.DefinePlugin({
        'process.env' : {
          'WP_URL': JSON.stringify('https://davehakkens.nl'),
          'WP_LOGIN': JSON.stringify('https://davehakkens.nl/community/login?redirect_to=')
        }
      })
    ]
  });
};

module.exports = mergedConfig();
