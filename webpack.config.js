const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const createTransformer = require('./babel/novelPlugin.js');

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, 'packages/index.ts'),
  output: {
    path: path.join(__dirname, './public'),
    filename: 'novel.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'packages'),
    },
  },
  // optimization: {
  //   sideEffects: true, // 开启副作用标识功能
  //   usedExports: true,
  //   minimize:true,
  // },
  devServer: {
    port: 80,
    hot: true,
    static: {
      directory: path.join(__dirname, 'packages'),
      // directory: path.join(__dirname, 'public'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: (program) => ({
                before: [createTransformer],
              }),
            },
          },
        ],
      },
      {
        test: /\.css?$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.scss?$/,
        use: [
          // { loader: 'resolve-url-loader' },
          // {
          // loader: 'style-resources-loader',
          // options: {
          //   patterns: [
          //     path.resolve(
          //       __dirname,
          //       './packages/component/icon/style/regular.scss',
          //     ),
          //   ],
          // },
          // },
          // {loader:'style-loader'},
          {
            loader: 'css-loader',
          },

          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      { test: /\.svg$/, use: 'svg-inline-loader' },
      // { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'resolve-url-loader' },
      // { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
      {
        test: /\.(png|jpe?g|gif|ttf|eot|svg|woff|woff2)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (path) => {
                // console.log(process.env.NODE_ENV);

                if (process.env.NODE_ENV === 'development') {
                  return '[path][name].[ext]';
                }

                if (/\.ttf|\.eot|\.woff|\.woff2/.test(path)) {
                  return 'static/fonts/[name].[ext]';
                }

                return '[path][name].[ext]';
              },
              context: 'packages',
              // outputPath: "public/fonts/"
              // publicPath: function (url) {
              //   //返回最终的资源相对路径
              //   return path.relative('packages', url).replace(/\\/g, '/');
              // },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Novel: [path.resolve(__dirname, 'packages/core/index.ts'), 'default'],
      'Novel.createVirtualElement': [
        path.resolve(__dirname, 'packages/core/index.ts'),
        'createVirtualElement',
      ],
    }),
  ],
};
