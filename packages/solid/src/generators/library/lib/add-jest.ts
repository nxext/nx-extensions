import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addJest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  ensurePackage('@nx/jest', NX_VERSION);
  const { jestProjectGenerator } = await import('@nx/jest');

  return await jestProjectGenerator(host, {
    project: options.name,
    supportTsx: false,
    skipSerializers: true,
    setupFile: 'none',
    babelJest: false,
  });
}
