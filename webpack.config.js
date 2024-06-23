const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const functionsDir = path.join(__dirname, 'lambda_function_handlers');
const functionFiles = fs.readdirSync(functionsDir);

const entry = functionFiles.reduce((entries, file) => {
  if (path.extname(file) === '.ts' && !file.endsWith('.d.ts')) {
    const functionName = path.parse(file).name;
    entries[`${functionName}-compiled`] = path.join(functionsDir, file);
  }
  return entries;
}, {});

module.exports = {
  mode: 'production',
  entry,
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules|\.d\.ts$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  devtool: false,
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },
  externals: {
    '@aws-sdk/client-dynamodb': '@aws-sdk/client-dynamodb',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};