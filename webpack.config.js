module.exports = function(env) {
  return env === 'prod'
    ? require('./webpack.prod.js')
    : require('./webpack.common.js')
}
