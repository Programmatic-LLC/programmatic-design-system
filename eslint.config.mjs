import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{ ignores: ['dist', 'node_modules', 'coverage', 'storybook-static'] },
	{
		files: ['**/*.{ts,tsx}'],
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
		},
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'semi': ['error', 'always'],
			'no-trailing-spaces': 'error',
			'eol-last': 'error',
			'indent': ['error', 'tab'],
			'prefer-template': 'error',
			'padding-line-between-statements': [
				'error',
				{ blankLine: 'always', prev: 'function', next: 'function' },
			],
			'prefer-const': 'error',
			'no-inline-comments': 'error',
			'spaced-comment': 'off',
			'no-console': 'error',
			'no-empty': ['error', { allowEmptyCatch: true }],
			'no-var': 'error',
			'no-eval': 'error',
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/rules-of-hooks': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/immutability': 'error',
			'react-hooks/static-components': 'error',
			'react-hooks/purity': 'error',
			'react-hooks/preserve-manual-memoization': 'error',
		},
		settings: {
			react: { version: 'detect' },
		},
	},
	{
		files: ['src/components/EntityCard/EntityCard.tsx', '**/*.test.{ts,tsx}'],
		rules: {
			'react-hooks/static-components': 'off',
		},
	},
)
