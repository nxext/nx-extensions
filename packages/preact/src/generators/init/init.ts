import { Schema } from './schema';
import { formatFiles, Tree, runTasksInSerial } from '@nx/devkit';
import { addJestPlugin } from './lib/add-jest-plugin';
import { addCypressPlugin } from './lib/add-cypress-plugin';
import { updateDependencies } from './lib/add-dependencies';

export async function initGenerator(host: Tree, options: Schema) {
  const installTask = updateDependencies(host);
  const jestTask = await addJestPlugin(host, options);
  const cypressTask = await addCypressPlugin(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(installTask, jestTask, cypressTask);
}
