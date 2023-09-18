import {
  convertNxGenerator,
  formatFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
} from '@nx/devkit';
import { NormalizedSchema, Schema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { addVite } from './lib/add-vite';
import { updateViteConfig } from './lib/update-vite-config';
import { createApplicationFiles } from './lib/create-project-files';
import { normalizeOptions } from './lib/normalize-options';

export async function applicationGenerator(
  host: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  return await applicationGeneratorInternal(host, {
    projectNameAndRootFormat: 'derived',
    ...schema,
  });
}

export async function applicationGeneratorInternal(host: Tree, schema: Schema) {
  const options = await normalizeOptions(host, schema);

  const initTask = await initGenerator(host, { ...options, skipFormat: true });

  addProject(host, options);
  await createApplicationFiles(host, options);

  const viteTask = await addVite(host, options);
  const lintTask = await addLinting(host, options);
  const jestTask = await addJest(host, options);
  const cypressTask = await addCypress(host, options);

  updateJestConfig(host, options);
  updateViteConfig(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
