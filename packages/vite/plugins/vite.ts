import { defineConfig } from 'vite';
import viteNxProjectPaths from '../src/executors/utils/nx-project-paths';

export function defineBaseConfig(workspaceRoot: string) {
  return defineConfig(() => {
    return {
      plugins: [viteNxProjectPaths({ workspaceRoot })],
      build: {
        target: 'esnext',
      },
    };
  });
}
