const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Read all files in the "functions" directory
const functionsDir = path.join(__dirname, 'lambda_function_handlers');
const functionFiles = fs.readdirSync(functionsDir);

// Create an entry object mapping each TypeScript file in the "functions" directory to its output JavaScript file in the "dist" directory
const entry = functionFiles.reduce((entries, file) => {
  if (path.extname(file) === '.ts' && !file.endsWith('.d.ts')) { // Only process .ts files and exclude .d.ts files
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
    minimize: false
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the "dist" directory before each build
  ],
};