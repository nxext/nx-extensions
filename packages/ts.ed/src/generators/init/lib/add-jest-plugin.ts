import { jestInitGenerator } from '@nrwl/jest';
import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { hasNxPackage, readNxVersion } from './util';

export function addJestPlugin(tree: Tree): GeneratorCallback {
  const tasks: GeneratorCallback[] = [];
  const hasNrwlJestDependency: boolean = hasNxPackage(tree, '@nrwl/jest');

  if (!hasNrwlJestDependency) {
    const nxVersion = readNxVersion(tree);

    const installTask = addDependenciesToPackageJson(
      tree,
      {},
      { '@nrwl/jest': nxVersion }
    );
    tasks.push(installTask);
  }

  const jestTask = jestInitGenerator(tree, {});
  tasks.push(jestTask);

  return runTasksInSerial(...tasks);
}
