import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { InitSchema } from './schema';
import { addStyledDependencies } from './lib/add-style-module-dependencies';
import { addE2eTestDependencies } from './lib/add-e2e-dependencies';
import { addDependenciesByApptype } from './lib/add-dependencies-for-apptype';
import { convertNxGenerator, formatFiles, GeneratorCallback, Tree, updateJson } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function initGenerator<T extends InitSchema>(
  host: Tree,
  options: T
) {
  const tasks: GeneratorCallback[] = [];

  tasks.push(addDependenciesByApptype(host, options.appType));
  tasks.push(...addStyledDependencies(host, options));

  if(options.e2eTestRunner === 'puppeteer') {
    tasks.push(...addE2eTestDependencies(host));
  }
  if(options.unitTestRunner === 'jest') {
    tasks.push(jestInitGenerator(host, {}));
  }

  setDefaultCollection(host, '@nxext/stencil');

  // Nx installs Jest 27.x by default now, 'stencil test' just works with 26
  updateJson(host, 'package.json', pkgJson => {
    pkgJson.devDependencies['jest'] = '26.6.3';
    pkgJson.devDependencies['ts-jest'] = '26.5.6';
    pkgJson.devDependencies['jest-config'] = '26.6.3';

    return pkgJson;
  })

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(
    ...tasks
  );
}

export const initSchematic = convertNxGenerator(initGenerator);
