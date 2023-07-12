import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { ViteConfigurationGeneratorSchema } from '@nx/vite';

export async function addVite(host: Tree, options: NormalizedSchema) {
  await ensurePackage('@nx/vite', NX_VERSION);
  const { viteConfigurationGenerator } = await import('@nx/vite');

  const config: ViteConfigurationGeneratorSchema = {
    uiFramework: 'none',
    project: options.name,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: false,
  };

  return await viteConfigurationGenerator(host, config);
}
