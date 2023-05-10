import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addVite(host: Tree, options: NormalizedSchema) {
  if (options.buildable || options.publishable) {
    const { viteConfigurationGenerator } = ensurePackage<
      typeof import('@nx/vite')
    >('@nx/vite', NX_VERSION);

    return await viteConfigurationGenerator(host, {
      uiFramework: 'none',
      project: options.name,
      newProject: true,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      skipFormat: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}
