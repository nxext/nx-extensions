import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addVitest(host: Tree, options: NormalizedSchema) {
  if (
    !options.buildable &&
    !options.publishable &&
    options.unitTestRunner === 'vitest'
  ) {
    ensurePackage('@nx/vitest', NX_VERSION);
    const { configurationGenerator } = await import('@nx/vitest/generators');

    return await configurationGenerator(host, {
      uiFramework: 'none',
      project: options.name,
      coverageProvider: 'v8',
      inSourceTests: false,
      skipFormat: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}
