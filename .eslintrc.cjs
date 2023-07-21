module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs'],
  plugins: [
    '@typescript-eslint',
    'unicorn',
    'jsx-a11y',
    'sonarjs',
    'prefer-arrow',
  ],
  extends: [
    'eslint:recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:jsx-a11y/recommended',
    'plugin:unicorn/recommended',
    'plugin:sonarjs/recommended',
    'plugin:svelte/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    parser: '@typescript-eslint/parser',
    extraFileExtensions: [".svelte"],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            importNames: ['default'],
            message: 'Import specific named functions, like `import { map } from "lodash"`',
            name: 'lodash',
          },
        ],
      },
    ],
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    'no-undef': 'off', // Handled by TS
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eol-last': 'error',
    'one-var': [
      'error',
      {
        let: 'never',
        const: 'never',
      },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'never',
        functions: 'never',
      },
    ],
    eqeqeq: ['error', 'always', { null: 'always' }],
    'no-unreachable-loop': 'error',
    'no-unsafe-optional-chaining': 'error',
    'require-atomic-updates': 'error',
    'array-callback-return': 'error',
    'no-caller': 'error',
    'no-multi-spaces': 'error',
    'no-param-reassign': 'error',
    'no-return-await': 'error',
    radix: 'error',
    'require-await': 'error',
    strict: 'error',
    yoda: 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'properties'],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',

    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],

    // Unicorn
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/no-unused-properties': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/import-index': 'error',
    'unicorn/import-style': 'error',
    // @todo : re-anable prefer-at when support exists https://caniuse.com/mdn-javascript_builtins_array_at
    'unicorn/prefer-at': 'off',
    'unicorn/prefer-object-has-own': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/string-content': 'error',

    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/no-array-for-each': 'off',

    // Typescript
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'error',

    // Sonar
    'sonarjs/no-duplicate-string': 'off',
  },
}
