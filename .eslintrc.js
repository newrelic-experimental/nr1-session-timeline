module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:@newrelic/eslint-plugin-newrelic/react',
    'plugin:@newrelic/eslint-plugin-newrelic/jest',
    'plugin:@newrelic/eslint-plugin-newrelic/prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'es5',
        semi: false,
      },
    ],
    'react/prop-types': 'warn',
    'react/no-unused-state': 'warn',
  },
}
