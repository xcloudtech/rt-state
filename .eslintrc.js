module.exports = {
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-multiple-empty-lines': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'function-paren-newline': 'off',
    'prefer-const': 'error'
  },
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
};
