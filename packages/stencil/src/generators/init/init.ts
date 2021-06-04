import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { InitSchema } from './schema';
import { addStyledDependencies } from './lib/add-style-module-dependencies';
import { addE2eTestDependencies } from './lib/add-e2e-dependencies';
import { addDependenciesByApptype } from './lib/add-dependencies-for-apptype';
import { convertNxGenerator, GeneratorCallback, Tree } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function initGenerator<T extends InitSchema>(
  tree: Tree,
  options: T
) {
  const tasks: GeneratorCallback[] = [];

  tasks.push(addDependenciesByApptype(tree, options.appType));
  tasks.push(...addStyledDependencies(tree, options));
  tasks.push(...addE2eTestDependencies(tree));
  tasks.push(jestInitGenerator(tree, {}));

  setDefaultCollection(tree, '@nxext/stencil');

  return runTasksInSerial(...tasks);
}

export const initSchematic = convertNxGenerator(initGenerator);
