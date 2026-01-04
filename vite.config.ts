import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		// Bundle analyzer for build optimization
		process.env.NODE_ENV === 'production' &&
			visualizer({
				filename: 'dist/stats.html',
				open: false,
				gzipSize: true,
				brotliSize: true
			})
	].filter(Boolean),

	// Build optimizations for static hosting
	build: {
		// Improve chunk splitting for better caching
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Framework chunks
					if (id.includes('svelte/')) {
						return 'svelte';
					}

					// Third-party libraries
					if (id.includes('lucide-svelte')) {
						return 'lucide';
					}

					// App-specific chunks
					if (id.includes('/src/lib/data/')) {
						return 'holidays';
					}

					if (id.includes('/src/lib/components/')) {
						return 'components';
					}
				}
			}
		},

		// Inline CSS smaller than this threshold
		cssCodeSplit: true,
		cssMinify: true,

		// Target modern browsers for better compression
		target: 'es2020',

		// Enable sourcemaps for debugging but minimize them
		sourcemap: false
	},

	test: {
		expect: { requireAssertions: true },

		projects: [
			{
				extends: './vite.config.ts',

				test: {
					name: 'client',

					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},

					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
