import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { InitSchema } from './schema';
import { addStyledDependencies } from './lib/add-style-module-dependencies';
import { addPuppeteer } from './lib/add-e2e-dependencies';
import { addDependenciesByApptype } from './lib/add-dependencies-for-apptype';
import { convertNxGenerator, formatFiles, Tree } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';

export async function initGenerator<T extends InitSchema>(
  host: Tree,
  options: T
) {
  const dependenciesTask = addDependenciesByApptype(host, options.appType);
  const styleDependenciesTask = addStyledDependencies(host, options);
  const addPuppeteerTask = await addPuppeteer(host, options);
  const addCypressTask = await addCypress(host, options);
  const jestInitTask = await addJest(host, options);

  setDefaultCollection(host, '@nxext/stencil');

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(
    dependenciesTask,
    styleDependenciesTask,
    addPuppeteerTask,
    addCypressTask,
    jestInitTask
  );
}

export const initSchematic = convertNxGenerator(initGenerator);
