import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { InitSchema } from './schema';
import { addStyledDependencies } from './lib/add-style-module-dependencies';
import { addE2eTestDependencies } from './lib/add-e2e-dependencies';
import { addDependenciesByApptype } from './lib/add-dependencies-for-apptype';
import { convertNxGenerator, GeneratorCallback, Tree, updateJson } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function initGenerator<T extends InitSchema>(
  tree: Tree,
  options: T
) {
  const tasks: GeneratorCallback[] = [];

  tasks.push(addDependenciesByApptype(tree, options.appType));
  tasks.push(...addStyledDependencies(tree, options));

  if(options.e2eTestRunner === 'puppeteer') {
    tasks.push(...addE2eTestDependencies(tree));
  }
  if(options.unitTestRunner === 'jest') {
    tasks.push(jestInitGenerator(tree, {}));
  }

  setDefaultCollection(tree, '@nxext/stencil');

  // Nx installs Jest 27.x by default now, 'stencil test' just works with 26
  updateJson(tree, 'package.json', pkgJson => {
    pkgJson.devDependencies['jest'] = '26.6.3';
    pkgJson.devDependencies['ts-jest'] = '26.5.6';

    return pkgJson;
  })

  return runTasksInSerial(
    ...tasks
  );
}

export const initSchematic = convertNxGenerator(initGenerator);
