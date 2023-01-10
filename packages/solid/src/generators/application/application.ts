import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { NormalizedSchema, Schema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { normalizeOptions } from './lib/normalize-options';
import { createViteConfiguration } from './lib/vite-config';

function createFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    options.appProjectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    }
  );
}

export async function applicationGenerator(
  host: Tree,
  schema: Schema
) {
  const options = normalizeOptions(host, schema);

  const initTask = await initGenerator(host, { ...options, skipFormat: true });
  addProject(host, options);
  const viteTask = await createViteConfiguration(host, options);
  createFiles(host, options);

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
export const applicationSchematic = convertNxGenerator(applicationGenerator);
