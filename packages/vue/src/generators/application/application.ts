import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import { Schema } from './schema';
import { addProject } from './lib/add-project';
import { createApplicationFiles } from './lib/create-application-files';
import { normalizeOptions } from './lib/normalize-options';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { updateViteConfig } from './lib/update-vite-config';
import { addCypress } from './lib/add-cypress';
import { addLinting } from './lib/add-linting';
import initGenerator from '../init/init';
import { readNxVersion } from '../utils/utils';

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  addProject(host, options);
  createApplicationFiles(host, options);

  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });

  await ensurePackage(host, '@nrwl/vite', readNxVersion(host));
  const { viteConfigurationGenerator } = await import('@nrwl/vite');
  const viteTask = await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.appProjectName,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: options.inSourceTests,
  });
  updateViteConfig(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  const lintTask = await addLinting(host, options);
  const cypressTask = await addCypress(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, cypressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
