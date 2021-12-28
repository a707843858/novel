const Webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  { cwd } = require('process');
const webConfigTemplate = require('./config/web.config'),
  componentConfigTemplate = require('./config/component.config');

const basePath = cwd();
const webConfig = webConfigTemplate(basePath),
  componentConfig = componentConfigTemplate(basePath);

const webCompiler = Webpack(
    { ...webConfig, mode: 'development' },
    (err, status) => {
      if (err || status.hasErrors()) {
        console.log(err);
      }
    },
  ),
  componentCompiler = Webpack(
    { ...componentConfig, mode: 'development' },
    (err, status) => {
      if (err || status.hasErrors()) {
        console.log(err);
      }
    },
  );

webCompiler.watch(
  {
    aggregateTimeout: 300,
    poll: 1000,
  },
  (err, stats) => {
    console.log(stats);
  },
);

componentCompiler.watch(
  {
    aggregateTimeout: 300,
    poll: 1000,
  },
  (err, stats) => {
    console.log(stats);
  },
);

const webServer = new WebpackDevServer(
    { ...webConfig.devServer, hot: true },
    webCompiler,
  ),
  componentServer = new WebpackDevServer(
    { ...componentConfig.devServer, hot: true },
    componentCompiler,
  );

const runServer = async () => {
  console.log('Starting server...');
  await componentServer.start();
  await webServer.start();
};

runServer().then(() => {});
