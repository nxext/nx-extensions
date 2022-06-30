import { Schema } from './schema';
import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nxext/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addJestPlugin } from './lib/add-jest-plugin';
import { addCypressPlugin } from './lib/add-cypress-plugin';
import { updateDependencies } from './lib/add-dependencies';
import { addLinterPlugin } from './lib/add-linter-plugin';
import { addVitestPlugin } from './lib/add-vitest';

export async function initGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  const jestTask = addJestPlugin(host, schema);
  tasks.push(jestTask);

  const vitestTask = addVitestPlugin(host, schema);
  tasks.push(vitestTask);

  const cypressTask = addCypressPlugin(host, schema);
  tasks.push(cypressTask);

  const linterTask = addLinterPlugin(host);
  tasks.push(linterTask);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(...tasks);
}

export const initSchematic = convertNxGenerator(initGenerator);
