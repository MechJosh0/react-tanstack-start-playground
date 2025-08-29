//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    rules: {
      'max-params': ['error', 2],
    },
  },
];
