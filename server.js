const
  config = require('./webpack.config')(Object.assign(process.env, {
    stage: true
  })),
  webpack = require('webpack'),
  middleware = require('webpack-dev-middleware'),
  compiler = webpack(config),
  express = require('express'),
  app = express(),
  json = require('./dev/sample.json')

app.use('/json', (req, res, next) => {
  res.json(json)
})

app.use(middleware(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  contentBase: './dist',
  historyApiFallback: true,
  stats: {
    colors: true
  }
}));


app.listen(3000, () => console.log('Example app listening on port 3000!'))