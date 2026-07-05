import { Schema } from './schema';
import {
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { updateDependencies } from './lib/add-dependencies';
import { assertNotUsingTsSolutionSetup } from '@nx/js/internal';
import { addCypressInitPlugin, addJestInitPlugin } from '@nxext/common';

export async function initGenerator(host: Tree, schema: Schema) {
  assertNotUsingTsSolutionSetup(host, '@nxext/solid', 'init');

  const tasks: GeneratorCallback[] = [];

  const jestTask = await addJestInitPlugin(
    host,
    () => !schema.unitTestRunner || schema.unitTestRunner === 'jest'
  );
  tasks.push(jestTask);

  const cypressTask = await addCypressInitPlugin(
    host,
    () => !schema.e2eTestRunner || schema.e2eTestRunner === 'cypress'
  );
  tasks.push(cypressTask);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(...tasks);
}

export default initGenerator;
