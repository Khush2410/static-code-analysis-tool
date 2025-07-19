module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
      'eslint:recommended'
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      // Error level rules (will fail the build)
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      
      // Warning level rules
      'prefer-const': 'warn',
      'no-var': 'warn',
      
      // Stylistic rules
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    },
    ignorePatterns: [
      'node_modules/',
      'build/',
      'dist/',
      'coverage/',
      '*.min.js'
    ]
  };