import { jestInitGenerator } from '@nx/jest';
import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nx/devkit';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';
import { hasNxPackage, readNxVersion } from '../../utils/utils';
import { Schema } from '../schema';

export function addJestPlugin(tree: Tree, schema: Schema): GeneratorCallback {
  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const tasks: GeneratorCallback[] = [];
  const hasNrwlJestDependency: boolean = hasNxPackage(tree, '@nx/jest');

  if (!hasNrwlJestDependency) {
    const nxVersion = readNxVersion(tree);

    const installTask = addDependenciesToPackageJson(
      tree,
      {},
      { '@nx/jest': nxVersion }
    );
    tasks.push(installTask);
  }

  const jestTask = jestInitGenerator(tree, {});
  tasks.push(jestTask);

  return runTasksInSerial(...tasks);
}
