import {
  Tree,
  ensurePackage,
  NX_VERSION,
  GeneratorCallback,
  runTasksInSerial,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { createOrEditViteConfig } from '@nx/vite';

export async function addVite(host: Tree, options: NormalizedSchema) {
  const tasks: GeneratorCallback[] = [];

  if (options.buildable || options.publishable) {
    const { viteConfigurationGenerator } = ensurePackage<
      typeof import('@nx/vite')
    >('@nx/vite', NX_VERSION);

    const viteTask = await viteConfigurationGenerator(host, {
      uiFramework: 'none',
      project: options.name,
      newProject: true,
      includeLib: true,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      skipFormat: true,
    });
    tasks.push(viteTask);

    createOrEditViteConfig(
      host,
      {
        project: options.name,
        includeLib: false,
        includeVitest: options.unitTestRunner === 'vitest',
        inSourceTests: false,
        rollupOptionsExternal: [],
        imports: [`import { svelte } from '@sveltejs/vite-plugin-svelte'`],
        plugins: [`svelte()`],
      },
      false
    );
  }

  return runTasksInSerial(...tasks);
}
