import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nx/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { hasNxPackage, readNxVersion } from './util';
import { cypressInitGenerator } from '@nrwl/cypress';

export function addCypressPlugin(tree: Tree): GeneratorCallback {
  const tasks: GeneratorCallback[] = [];
  const hasNrwlCypressDependency: boolean = hasNxPackage(tree, '@nrwl/cypress');

  if (!hasNrwlCypressDependency) {
    const nxVersion = readNxVersion(tree);

    const installTask = addDependenciesToPackageJson(
      tree,
      {},
      { '@nrwl/cypress': nxVersion }
    );
    tasks.push(installTask);
  }

  const cypressTask = cypressInitGenerator(tree, {});
  tasks.push(cypressTask);

  return runTasksInSerial(...tasks);
}
