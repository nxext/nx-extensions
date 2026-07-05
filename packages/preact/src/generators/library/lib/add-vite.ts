import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { configureViteFrameworkPlugin } from '@nxext/common';
import { NormalizedSchema } from '../schema';
import { preactViteFrameworkConfig } from '../../utils/vite-config';

export async function addVite(host: Tree, options: NormalizedSchema) {
  await ensurePackage('@nx/vite', NX_VERSION);
  const { viteConfigurationGenerator } = await import('@nx/vite');

  const addViteTask = await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.name,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: false,
  });
  configureViteFrameworkPlugin(
    host,
    {
      project: options.name,
      includeLib: true,
      includeVitest: options.unitTestRunner === 'vitest',
    },
    preactViteFrameworkConfig
  );
  return addViteTask;
}
