import {
  Tree,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { angularInitGenerator as nxAngularInitGenerator } from '@nrwl/angular/generators';
import { viteInitGenerator } from '@nxext/vite';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { Schema } from './schema';
import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

export async function angularInitGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(schema);
  const tasks: GeneratorCallback[] = [];
  if (options.unitTestRunner === 'jest') {
    const jestTask = await jestInitGenerator(tree, {});
    tasks.push(jestTask);
  }

  const angularTask = await nxAngularInitGenerator(tree, {
    ...options,
    unitTestRunner: UnitTestRunner.Jest,
  });
  tasks.push(angularTask);

  setDefaultCollection(tree, '@nxext/angular');
  const viteTask = await viteInitGenerator(tree, {
    ...options,
    unitTestRunner: 'jest',
  });
  tasks.push(viteTask);

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default angularInitGenerator;
export const angularSchematic = convertNxGenerator(angularInitGenerator);
