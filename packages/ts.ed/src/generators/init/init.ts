import { Schema } from './schema';
import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nx/devkit';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';
import { addJestPlugin } from './lib/add-jest-plugin';
import { addCypressPlugin } from './lib/add-cypress-plugin';
import { updateDependencies } from './lib/add-dependencies';
import { addLinterPlugin } from './lib/add-linter-plugin';

export async function initGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    const jestTask = addJestPlugin(host);
    tasks.push(jestTask);
  }
  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
    const cypressTask = addCypressPlugin(host);
    tasks.push(cypressTask);
  }

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
