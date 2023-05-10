import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';
import { updateViteConfig } from './update-vite-config';

export async function addVite(host: Tree, options: NormalizedSchema<Schema>) {
  await ensurePackage('@nx/vite', NX_VERSION);
  const { viteConfigurationGenerator } = await import('@nx/vite');

  const viteTask = await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.appProjectName,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: options.inSourceTests,
  });
  updateViteConfig(host, options);
  return viteTask;
}
