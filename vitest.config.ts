import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		css: false,
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.stories.tsx',
				'src/**/index.ts',
				'src/tokens/**',
				'src/foundations/**',
			],
			thresholds: {
				statements: 90,
				branches: 80,
				functions: 90,
				lines: 90,
			},
		},
	},
});
