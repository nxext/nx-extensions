import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [tsconfigPaths({ projects: ['tsconfig.app.json'] })],
    build: {
      target: 'esnext',
    },
  };
});
