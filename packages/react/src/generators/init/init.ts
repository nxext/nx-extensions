import {
  Tree,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { reactInitGenerator as nxReactInitGenerator } from '@nrwl/react';
import { viteInitGenerator } from '@nxext/vite';

import { Schema } from './schema';
import { addJestPlugin } from './lib/add-jest-plugin';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { updateDependencies } from './lib/add-dependencies';

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

export async function reactInitGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(schema);

  if (options.unitTestRunner === 'jest') {
    const jestTask = addJestPlugin(host);
    tasks.push(jestTask);
  }

  const reactTask = await nxReactInitGenerator(host, {
    ...options,
    e2eTestRunner: 'none',
  });
  tasks.push(reactTask);
  const viteTask = await viteInitGenerator(host, options);
  tasks.push(viteTask);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default reactInitGenerator;
export const reactSchematic = convertNxGenerator(reactInitGenerator);
