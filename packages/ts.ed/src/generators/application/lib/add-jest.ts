import { Tree } from '@nxext/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { NormalizedSchema } from '../schema';

export async function addJest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  return await jestProjectGenerator(host, {
    project: options.name,
    supportTsx: false,
    skipSerializers: true,
    setupFile: 'none',
    babelJest: false,
  });
}
