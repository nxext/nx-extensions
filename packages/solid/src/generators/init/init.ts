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
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';

export async function initGenerator(host: Tree, schema: Schema) {
  assertNotUsingTsSolutionSetup(host, '@nxext/solid', 'init');

  const tasks: GeneratorCallback[] = [];

  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    const jestTask = await addJestPlugin(host);
    tasks.push(jestTask);
  }
  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
    const cypressTask = await addCypressPlugin(host);
    tasks.push(cypressTask);
  }

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(...tasks);
}

export default initGenerator;
