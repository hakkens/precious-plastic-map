var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [ 'babel-polyfill', path.join(__dirname, 'src', 'index.js') ],
  devtool: "#inline-source-map",
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: [
          'node_modules/',
          'lib/'
        ],
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015", "es2017"]
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Precious Plastic',
      template: path.join(__dirname, 'src', 'index.ejs'),
      inject: 'head',
      googleKey: 'AIzaSyCrb3BB8Wg-YaCs8JXtFCeNGY2YPAmATrc'
    })
  ]
};
