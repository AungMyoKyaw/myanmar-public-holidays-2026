import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},

		rules: {
			// TypeScript best practices (no type checking required)
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],

			// Code quality - Modern JS
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-template': 'error',
			'prefer-destructuring': ['error', { object: true, array: true }],
			'prefer-spread': 'error',
			'no-duplicate-imports': 'error',

			// Best practices
			'no-return-await': 'error',
			'require-await': 'error',
			'no-else-return': ['error', { allowElseIf: false }],
			'no-empty-function': 'warn',
			'no-nested-ternary': 'warn',
			'no-unneeded-ternary': 'error',

			// Performance & maintainability
			'no-lone-blocks': 'warn',
			'no-loop-func': 'warn',
			complexity: ['warn', 10],

			// Consistency
			curly: ['error', 'all'],
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			yoda: 'error'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},

		rules: {
			// Type-checking rules for Svelte files (where type checking is enabled)
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-misused-promises': 'warn',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-implied-eval': 'error',

			// Svelte-specific best practices
			'svelte/no-at-html-tags': 'error',
			'svelte/no-target-blank': 'error',
			'svelte/prefer-class-directive': 'error'
		}
	},
	{
		files: ['**/*.test.ts', '**/*.spec.ts'],

		rules: {
			// Relax rules for test files
			'no-console': 'off',
			'@typescript-eslint/no-explicit-any': 'off'
		}
	}
);
