const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
module.exports = {
  mode: 'development',
  entry: {
    background: './src/background.js',
    options: './src/options/index.tsx',
    contentScript: './src/contentScript/index.tsx',
    popup: './src/popup/index.tsx',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: '8090',
    static: './dist'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/assets/icons', to: 'icons' },
      ]
    }),
  ],
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
}
