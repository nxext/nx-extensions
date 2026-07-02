import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addJest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  const { configurationGenerator } = ensurePackage<typeof import('@nx/jest')>(
    '@nx/jest',
    NX_VERSION
  );

  return await configurationGenerator(host, {
    project: options.name,
    supportTsx: false,
    skipSerializers: true,
    setupFile: 'none',
    babelJest: false,
  });
}
