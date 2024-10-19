import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addVite(host: Tree, options: NormalizedSchema) {
  await ensurePackage('@nx/vite', NX_VERSION);
  const { viteConfigurationGenerator, createOrEditViteConfig } = await import(
    '@nx/vite'
  );

  const addViteTask = await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.name,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: false,
  });
  createOrEditViteConfig(
    host,
    {
      project: options.name,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      rollupOptionsExternal: [],
      imports: [`import preact from '@preact/preset-vite'`],
      plugins: [`preact()`],
    },
    false
  );
  return addViteTask;
}
