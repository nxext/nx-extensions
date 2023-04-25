import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nx/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { hasNxPackage, readNxVersion } from '../../utils/utils';
import { cypressInitGenerator } from '@nrwl/cypress';
import { Schema } from '../schema';

export function addCypressPlugin(
  tree: Tree,
  schema: Schema
): GeneratorCallback {
  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

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
