import { config } from '@repo/eslint-config/base';
import tsParser from '@typescript-eslint/parser';

export default [
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];