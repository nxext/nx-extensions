import {
  ensurePackage,
  GeneratorCallback,
  NX_VERSION,
  runTasksInSerial,
  Tree,
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
        includeLib: true,
        includeVitest: options.unitTestRunner === 'vitest',
        inSourceTests: false,
        rollupOptionsExternal: [],
        imports: [`import solidPlugin from 'vite-plugin-solid'`],
        plugins: [`solidPlugin()`],
      },
      false
    );
  }

  return runTasksInSerial(...tasks);
}
