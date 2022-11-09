module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.eslint.json',
    sourceType: 'module', // Allows for the use of imports
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-empty': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
};

// module.exports = {
//   root: true,
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
//     sourceType: 'module', // Allows for the use of imports
//   },
//   env: {
//     commonjs: true,
//   },
//   plugins: ['@typescript-eslint'],
//   extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
//   rules: {
//     'no-empty': 'off',
//     'no-empty-function': 'off',
//     '@typescript-eslint/no-empty-function': 'off',
//   },
// };
