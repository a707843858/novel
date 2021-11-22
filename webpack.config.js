const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'packages/index.ts'),
  output: {
    path: path.join(__dirname, './public/js'),
    filename: 'novel.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  // optimization: {
  //   sideEffects: true, // 开启副作用标识功能
  //   usedExports: true,
  //   minimize:true,
  // },
  devServer: {
    port: 80,
    hot: true,
    filename: 'novel.js',
    contentBase: path.join(__dirname, 'packages'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-react',
                  { pragma: 'Novel.createVirtalElement' },
                ],
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }], // 这个是装饰器
                ['@babel/plugin-proposal-class-properties', { loose: false }],
              ],
            },
          },
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.scss?$/,
        use: [
          // { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      { test: /\.svg$/, use: 'svg-inline-loader' },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Novel: [path.resolve(__dirname, 'packages/core/index.ts'), 'default'],
      'Novel.createVirtalElement': [
        path.resolve(__dirname, 'packages/core/index.ts'),
        'createVirtalElement',
      ],
    }),
  ],
};
