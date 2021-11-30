import { defineConfig } from 'vite';
export default ({
  name,
  external,
  globals,
  entry,
}: {
  entry: string;
  name?: string;
  external?: string[];
  globals?: Record<string, string>;
}) =>
  defineConfig(() => {
    return {
      plugins: [],
      build: {
        target: 'esnext',
        lib: {
          entry: entry,
          name: name,
          fileName: (format) => `${name}.${format}.js`,
        },
        rollupOptions: {
          // make sure to externalize deps that shouldn't be bundled
          // into your library
          external: external ?? [],
          output: {
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: globals ?? {},
          },
        },
      },
    };
  });
