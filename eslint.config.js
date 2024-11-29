import react from 'eslint-plugin-react'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import love from 'eslint-config-love'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [...compat.extends(
  'plugin:react/recommended',
  'prettier',
  'eslint:recommended',
), {
  ...love,
  plugins: {
    react,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.jest,
    },

    ecmaVersion: 'latest',
    sourceType: 'module',

    parserOptions: {
      project: './tsconfig.json',
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    indent: ['error', 2],
    'linebreak-style': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],

    'arrow-spacing': ['error', {
      before: true,
      after: true,
    }],

    'no-console': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
  },
}]