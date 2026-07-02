import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

/**
 * addVite() only sets up vite (and, via includeVitest, vitest) for
 * buildable/publishable libs. Non-buildable, non-publishable libs still
 * need a test target when unitTestRunner is vitest, so this configures
 * @nx/vitest directly for that case.
 */
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
