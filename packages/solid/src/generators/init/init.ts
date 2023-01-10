import { Schema } from './schema';
import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { updateDependencies } from './lib/add-dependencies';
import { readNxVersion } from './lib/util';

export async function initGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    await ensurePackage(host, '@nrwl/jest', readNxVersion(host));
    const { jestInitGenerator } = await import('@nrwl/jest');
    const jestTask = jestInitGenerator(host, {});
    tasks.push(jestTask);
  }

  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
    await ensurePackage(host, '@nrwl/cypress', readNxVersion(host));
    const { cypressInitGenerator } = await import('@nrwl/cypress');
    const cypressTask = cypressInitGenerator(host, {});
    tasks.push(cypressTask);
  }

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(...tasks);
}

export const initSchematic = convertNxGenerator(initGenerator);
