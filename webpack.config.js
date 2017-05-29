const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/js/index'
  },
  module: {
    loaders: []
  },
  output: {
    path: require('path').join(__dirname, 'public'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      '__dev__': process.env.NODE_ENV === 'development'
    })
  ].concat(process.env.NODE_ENV === 'production'
    ? new webpack.optimize.UglifyJsPlugin()
    : [])
}
