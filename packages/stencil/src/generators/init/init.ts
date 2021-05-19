import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { InitSchema } from './schema';
import { addStyledDependencies } from './lib/add-style-module-dependencies';
import { addE2eTestDependencies } from './lib/add-e2e-dependencies';
import { moveNxextToDevDependencies } from './lib/move-nxext-to-dev-dependencies';
import { addDependenciesByApptype } from './lib/add-dependencies-for-apptype';
import { convertNxGenerator, GeneratorCallback, Tree } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function initGenerator<T extends InitSchema>(
  host: Tree,
  options: T
) {
  const tasks: GeneratorCallback[] = [];

  moveNxextToDevDependencies(host);
  tasks.push(addDependenciesByApptype(host, options.appType));
  tasks.push(...addStyledDependencies(host, options));
  tasks.push(...addE2eTestDependencies(host));
  tasks.push(jestInitGenerator(host, {}));

  setDefaultCollection(host, '@nxext/stencil');

  return runTasksInSerial(...tasks);
}

export const initSchematic = convertNxGenerator(initGenerator);
