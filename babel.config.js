const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    ['import', {
      'libraryName': 'ant-design-vue',
      'libraryDirectory': 'es',
      'style': true, // `style: true` 会加载 less 文件
    }],
    IS_PROD && 'transform-remove-console',
  ].filter(Boolean),
};
