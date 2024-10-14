import { Schema } from './schema';
import {
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { addJestPlugin } from './lib/add-jest-plugin';
import { addCypressPlugin } from './lib/add-cypress-plugin';
import { updateDependencies } from './lib/add-dependencies';
import { addLinterPlugin } from './lib/add-linter-plugin';
import { addPluginToNxJson } from '../utils/add-plugin-to-nx-json';

export async function initGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  const jestTask = await addJestPlugin(host, schema);
  tasks.push(jestTask);

  const cypressTask = await addCypressPlugin(host, schema);
  tasks.push(cypressTask);

  const linterTask = await addLinterPlugin(host);
  tasks.push(linterTask);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  addPluginToNxJson('@nxext/svelte', host);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(...tasks);
}

export default initGenerator;
