module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-multiple-empty-lines': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'function-paren-newline': 'off',
    'prefer-const': 'error'
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
};
