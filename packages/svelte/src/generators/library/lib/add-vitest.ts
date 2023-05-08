import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { vitestProjectGenerator } from '@nxext/vitest';

export async function addVitest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'vitest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  return await vitestProjectGenerator(host, {
    project: options.name,
    framework: 'svelte',
  });
}
