import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Novel',
  mode: 'site',
  description: '介绍',
  locales: [['zh-CN', '中文']],
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
  scripts: [{ src: '/novel.js', type: 'module' }],
  styles: [
    `.__dumi-default-code-block { margin-top:10px;} `,
    `body { color:#e4ebf5 }`,
  ],
  // more config: https://d.umijs.org/config
});
