const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

const rules = {
  'no-console': 'error',
  'prettier/prettier': ['error', { endOfLine: 'auto' }],
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-extraneous-class': 'error',
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/typedef': 'error',
  '@typescript-eslint/unified-signatures': 'error',
};

const tsConfig = (dir) => ({
  files: [`${dir}/**/*.ts`],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      tsconfigRootDir: `${__dirname}/${dir}`,
      project: ['./tsconfig.json'],
    },
  },
  plugins: { '@typescript-eslint': tseslint, prettier: prettierPlugin },
  rules,
});

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      'app/lib/**',
      'lib/**',
      'shared/lib/**',
      'app/dist/**',
      '**/built-tests/**',
      '**/coverage/**',
    ],
  },
  {
    files: ['**/*.ts'],
    ...js.configs.recommended,
  },
  tseslint.configs['flat/eslint-recommended'],
  ...tseslint.configs['flat/recommended'].map((c) => ({
    ...c,
    files: ['**/*.ts'],
  })),
  ...tseslint.configs['flat/recommended-type-checked'].map((c) => ({
    ...c,
    files: ['**/*.ts'],
  })),
  { files: ['**/*.ts'], ...prettierConfig },
  tsConfig('src'),
  tsConfig('shared'),
  tsConfig('app'),
  {
    files: ['app/src/static/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
];
