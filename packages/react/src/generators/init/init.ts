import {
  Tree,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { reactInitGenerator as nxReactInitGenerator } from '@nrwl/react';
import { viteInitGenerator } from '@nxext/vite';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { Schema } from './schema';
import { addJestPlugin } from './lib/add-jest-plugin';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { updateDependencies } from './lib/add-dependencies';
import { addVitestPlugin } from './lib/add-vitest';

export async function reactInitGenerator(host: Tree, options: Schema) {
  const tasks: GeneratorCallback[] = [];

  const reactTask = await nxReactInitGenerator(host, {
    ...options,
    unitTestRunner:
      options.unitTestRunner === 'vitest' ? 'none' : options.unitTestRunner,
    e2eTestRunner: 'none',
  });
  tasks.push(reactTask);

  const jestTask = addJestPlugin(host, options);
  tasks.push(jestTask);

  const vitestTask = addVitestPlugin(host, options);
  tasks.push(vitestTask);

  const viteTask = await viteInitGenerator(host, options);
  tasks.push(viteTask);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  setDefaultCollection(host, '@nxext/react');

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default reactInitGenerator;
export const reactSchematic = convertNxGenerator(reactInitGenerator);
