const path = require('path'),
  webpack = require('webpack');

module.exports = function (basePath, mode = 'development') {
  const createTransformer = require('../babel/novelPlugin.js');

  console.log(basePath, 'basePath');

  return {
    watch: true,
    devtool: 'source-map',
    entry: path.resolve(basePath, './packages/index.tsx'),
    output: {
      path: path.resolve(basePath, './public'),
      filename: '_novel.js',
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      alias: {
        '@': path.resolve(basePath, './packages'),
      },
    },
    devServer: {
      port: 81,
      hot: true,
      host: '0.0.0.0',
      static: {
        directory: path.resolve(basePath, './public'),
        // publicPath:'http://0.0.0.0/',
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
        Novel: [path.resolve(basePath, './packages/core/index.ts'), 'default'],
        'Novel.createVirtualElement': [
          path.resolve(basePath, './packages/core/index.ts'),
          'createVirtualElement',
        ],
        'Novel.Fragment': [
          path.resolve(basePath, './packages/core/index.ts'),
          'Fragment',
        ],
      }),
    ],
  };
};
