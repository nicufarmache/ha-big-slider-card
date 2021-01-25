const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    filename: 'big-slider-card.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'raw-loader' }
    ]
  }
};
