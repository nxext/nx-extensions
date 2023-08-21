import { formatFiles, Tree, runTasksInSerial } from '@nx/devkit';
import { Schema } from './schema';
import { addProject } from './lib/add-project';
import { createApplicationFiles } from './lib/create-application-files';
import { normalizeOptions } from './lib/normalize-options';
import { addE2e } from './lib/add-e2e';
import { addLinting } from './lib/add-linting';
import initGenerator from '../init/init';
import { addVite } from './lib/add-vite';
import { setDefaults } from './lib/set-defaults';

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  addProject(host, options);
  createApplicationFiles(host, options);
  setDefaults(host, options);

  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });
  const viteTask = await addVite(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  const lintTask = await addLinting(host, options);
  const e2eTask = await addE2e(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, e2eTask);
}

export default applicationGenerator;
