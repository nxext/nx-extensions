import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      target: 'esnext',
    },
  };
});
