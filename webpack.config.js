const webpack = require('webpack');
module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/command.ts',
  output: {
    path: `${__dirname}/bin`,
    filename: 'ncmp.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig-bin.json',
          },
        },
        {
          loader: 'shebang-loader'
        }],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
  ],
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
};