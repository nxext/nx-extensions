import { defineConfig } from 'vite';
import viteNxProjectPaths from '../src/executors/utils/nx-project-paths';

export default ({
  name,
  workspaceRoot,
  external,
  globals,
  entry,
}: {
  entry: string;
  workspaceRoot: string;
  name?: string;
  external?: string[];
  globals?: Record<string, string>;
}) =>
  defineConfig(() => {
    return {
      plugins: [viteNxProjectPaths({ workspaceRoot })],
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
