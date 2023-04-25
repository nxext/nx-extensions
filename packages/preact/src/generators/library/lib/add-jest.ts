import { Tree, ensurePackage } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { readNxVersion } from '../../init/lib/util';

export async function addJest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  await ensurePackage(host, '@nrwl/jest', readNxVersion(host));
  const { jestProjectGenerator } = await import('@nrwl/jest');

  return await jestProjectGenerator(host, {
    project: options.name,
    supportTsx: false,
    skipSerializers: true,
    setupFile: 'none',
    babelJest: false,
  });
}
