const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    filename: 'ha-big-slider-card.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'raw-loader' }
    ]
  }
};
