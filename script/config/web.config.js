const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (basePath, mode = 'development') {
  return {
    watch: true,
    devtool: 'source-map',
    entry: path.resolve(basePath, './test/index.tsx'),
    output: {
      path: path.resolve(basePath, './public'),
      filename: '_novel.web.js',
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      alias: {
        '@': path.resolve(basePath, './packages'),
        '@test': path.resolve(basePath, './test'),
      },
    },
    devServer: {
      port: 80,
      hot: true,
      host: '0.0.0.0',
      historyApiFallback: true,
      static: {
        directory: path.resolve(basePath, './public'),
      },
      proxy: {
        '/_novel.js': {
          target: 'http://0.0.0.0:81/',
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react', '@babel/preset-env'],
              },
            },
            {
              loader: 'ts-loader',
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
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        'React.createElement': [
          path.resolve(basePath, './node_modules/react/index.js'),
          'createElement',
        ],
        React: [
          path.resolve(basePath, './node_modules/react/index.js'),
          'default',
        ],
      }),
      new HtmlWebpackPlugin({
        // template:path.resolve(basePath,'./test/index.html'),
        templateContent: `
        <html>
          <head>
            <title>Novel Component</title>
            <style>
            .demo-line {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 20px 0;
              }
             </style>
            <script src="./_novel.js"></script>
          </head>
          <body style=" background: #e4ebf5; text-align: center; padding: 20px; ">
            <div id="root"></div>
          </body>
        </html>
        `,
      }),
    ],
  };
};
