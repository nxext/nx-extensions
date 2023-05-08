import { Tree } from '@nx/devkit';
import { vitestProjectGenerator } from '@nxext/vitest';
import { NormalizedSchema } from '../schema';

export async function addVitest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'vitest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return vitestProjectGenerator(host, {
    project: options.projectName,
    framework: 'generic',
  });
}
