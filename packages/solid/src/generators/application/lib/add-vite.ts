import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addVite(host: Tree, options: NormalizedSchema) {
  await ensurePackage('@nx/vite', NX_VERSION);
  const { viteConfigurationGenerator } = await import('@nx/vite');

  return await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.name,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: false,
  });
}
