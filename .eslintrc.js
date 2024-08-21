module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:storybook/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
};