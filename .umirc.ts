import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Novel',
  mode: 'site',
  description:"xxxx",
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  navs: {
    'zh-CN': [
      {
        title: '组件',
        path: '/components',
      },
      {
        title: 'GitHub',
        path: 'https://github.com/umijs/dumi',
      },
    ],
  },
  publicPath: '/public/',
  scripts: [{ src: '/js/novel.js', type: 'module' }],
  styles: [`.__dumi-default-code-block { margin-top:10px;}`],
  // more config: https://d.umijs.org/config
});
