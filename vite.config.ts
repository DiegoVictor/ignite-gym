import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reportsDirectory: 'tests/coverage',
      include: ['src'],
      exclude: [
        'src/app.ts',
        'src/contracts',
        'src/env',
        'src/lib',
        'src/utils',
        'src/http/middlewares',
      ],
    },
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
});
