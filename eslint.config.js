import js from '@eslint/js'
import vueTsConfig from '@vue/eslint-config-typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'eslint.config.js',
      'package.json',
      '.vite/',
      'prettier.config.cjs',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsConfig(),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
  },
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      ...eslintConfigPrettier.rules,
      'prefer-const': 'error',
      'max-lines': ['warn', { max: 400 }],
      'max-params': ['error', 3],
    },
  },
  eslintConfigPrettier,
]
