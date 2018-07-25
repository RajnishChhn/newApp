const
  path = require('path'),

  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  //const AssetsPlugin = require('assets-webpack-plugin');
  packageJson = require('./package.json')

module.exports = function(env) {

  //Use production build type if the build is staging or production
  //const production = (env.build === BUILD_STAGE || env.build === BUILD_PROD)
  const release = process.argv.indexOf('-p') !== -1

  return {

    mode: 'development',

    context: path.join(__dirname, 'src'),

    entry: './js/index.js',

    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'assets/js/app.js',
      publicPath: '/'
    },

    devtool: !release ? 'source-map' : 'eval',

    bail: release,

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html')
      }),
      new ExtractTextPlugin(path.join('assets/css/app.css'))
    ],

    /*new AssetsPlugin(),
    new HtmlWebpackPlugin({
      template:  path.join(__dirname, 'src', 'index.html')
    }),*/

    module: {
      rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            sourceRoot: path.resolve(__dirname),
            only: [
              path.resolve(__dirname, 'src')
            ]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, {
            loader: 'sass-loader',
            options: {
              indentedSyntax: false,
              includePaths: [path.resolve(__dirname, 'node_modules')]
            }
          }],
          fallback: 'style-loader'
        })
      }]
    }
  }
}