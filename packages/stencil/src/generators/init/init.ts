import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { InitSchema } from './schema';
import { addStyledDependencies } from './lib/add-style-module-dependencies';
import { addE2eTestDependencies } from './lib/add-e2e-dependencies';
import { addDependenciesByApptype } from './lib/add-dependencies-for-apptype';
import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function initGenerator<T extends InitSchema>(
  host: Tree,
  options: T
) {
  const tasks: GeneratorCallback[] = [];

  tasks.push(addDependenciesByApptype(host, options.appType));
  tasks.push(...addStyledDependencies(host, options));

  if (options.e2eTestRunner === 'puppeteer') {
    tasks.push(...addE2eTestDependencies(host));
  }
  if (options.unitTestRunner === 'jest') {
    tasks.push(jestInitGenerator(host, {}));
  }

  setDefaultCollection(host, '@nxext/stencil');

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export const initSchematic = convertNxGenerator(initGenerator);
