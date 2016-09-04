module.exports = {
  entry: './client/index.js',
  output: {
    path: __dirname,
    filename: './client/static/bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }],
  },
  resolve: {
   extensions: ['', '.js', '.jsx'],
 }
};
