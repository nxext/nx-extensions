import { Tree } from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { NormalizedSchema } from '../schema';

export async function addJest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return await jestProjectGenerator(host, {
    project: options.projectName,
    supportTsx: true,
    skipSerializers: true,
    setupFile: 'none',
  });
}
