// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      routes: [
        {
          path: '/pdf',
          component: './pdf/pdf',
        },
        {
          path: '/drag',
          component: './drag/drag',
        },
        {
          path: '/test',
          component: './test',
          Routes: ['./src/pages/PrivateRoute.js'],
        },
        {
          path: '/draw',
          component: './draw',
        },
        {
          path: '/paint',
          component: './paint',
        },
        {
          path: '/',
          component: '../pages/index',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'ant-demo',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ], // chainWebpack(config) {
  //   config.module.rule('less-loader')
  //     .test( /\.less$/)
  //     .use('less-loader')
  //     .loader(require.resolve('less-loader'));
  // },
  // disableCSSModules: false,
};
