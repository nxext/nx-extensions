import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';
import { createOrEditViteConfig } from '@nx/vite';

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
  createOrEditViteConfig(
    host,
    {
      project: options.name,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      rollupOptionsExternal: [],
      imports: [`import vue from '@vitejs/plugin-vue'`],
      plugins: [`vue()`],
    },
    false
  );
  return viteTask;
}
