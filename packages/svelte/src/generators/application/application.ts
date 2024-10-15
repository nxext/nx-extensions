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
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';

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
