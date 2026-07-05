import {
  formatFiles,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
} from '@nx/devkit';
import { Schema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { addVite } from './lib/add-vite';
import { createApplicationFiles } from './lib/create-project-files';
import { normalizeOptions } from './lib/normalize-options';
import { createOrEditViteConfig } from '@nx/vite';
import { assertNotUsingTsSolutionSetup } from '@nx/js/internal';

export async function applicationGenerator(
  host: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  return await applicationGeneratorInternal(host, {
    ...schema,
  });
}

export async function applicationGeneratorInternal(host: Tree, schema: Schema) {
  assertNotUsingTsSolutionSetup(host, '@nxext/svelte', 'application');

  const options = await normalizeOptions(host, schema);

  const initTask = await initGenerator(host, { ...options, skipFormat: true });

  addProject(host, options);
  await createApplicationFiles(host, options);

  const viteTask = await addVite(host, options);
  const includeVitest = options.unitTestRunner === 'vitest';
  createOrEditViteConfig(
    host,
    {
      project: options.name,
      includeLib: false,
      includeVitest,
      inSourceTests: false,
      rolldownOptionsExternal: [],
      imports: [
        `import { svelte } from '@sveltejs/vite-plugin-svelte'`,
        // svelteTesting() no-ops outside `vitest` runs (it checks
        // process.env.VITEST) but is required for @testing-library/svelte v5:
        // it marks the package ssr.noExternal so vite-plugin-svelte can
        // transform its shipped .svelte sources, prefers the browser export
        // condition, and wires up DOM auto-cleanup. See
        // https://testing-library.com/docs/svelte-testing-library/setup
        ...(includeVitest
          ? [`import { svelteTesting } from '@testing-library/svelte/vite'`]
          : []),
      ],
      plugins: [`svelte()`, ...(includeVitest ? [`svelteTesting()`] : [])],
    },
    false
  );

  const lintTask = await addLinting(host, options);
  const jestTask = await addJest(host, options);
  const cypressTask = await addCypress(host, options);

  updateJestConfig(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
