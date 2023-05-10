import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addVitest(host: Tree, options: NormalizedSchema) {
  if (
    !options.buildable &&
    !options.publishable &&
    options.unitTestRunner === 'vitest'
  ) {
    const { vitestGenerator } = ensurePackage<typeof import('@nx/vite')>(
      '@nx/vite',
      NX_VERSION
    );

    return await vitestGenerator(host, {
      uiFramework: 'none',
      project: options.name,
      coverageProvider: 'c8',
      inSourceTests: false,
      skipFormat: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}
