import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addVite(host: Tree, options: NormalizedSchema) {
  const { viteConfigurationGenerator } = ensurePackage<
    typeof import('@nx/vite')
  >('@nx/vite', NX_VERSION);

  return await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.name,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: false,
  });
}
