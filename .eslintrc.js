const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    semi: ['error', 'always'], // 分号
    camelcase: 'off',
    'no-new': 'off',
    'no-console': IS_PROD ? 'warn' : 'off',
    'no-debugger': IS_PROD ? 'error' : 'off',
    'no-unreachable': IS_PROD ? 'error' : 'warn', // 提前return
    'prefer-promise-reject-errors': 'off',
    'standard/no-callback-literal': 'off',
    'no-unused-vars': IS_PROD ? 'error' : 'warn',
    'vue/no-unused-vars': 'off',
    'comma-dangle': ['error', 'always-multiline'], // 末尾逗号
    'indent': 'off',
    'vue/html-indent': [
      2,
      4, // 缩进4个空格
      {
        'attribute': 1,
        'closeBracket': 0,
        'alignAttributesVertically': true,
        'ignores': []
      }
    ],
    'vue/script-indent': [
      'error',
      4,
      {
        'baseIndent': 1
      }
    ],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always', // async箭头函数
    }],
  },
};
