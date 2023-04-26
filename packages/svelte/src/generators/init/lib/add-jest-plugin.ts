import { jestInitGenerator } from '@nx/jest';
import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  runTasksInSerial,
} from '@nx/devkit';
import { hasNxPackage, readNxVersion } from '../../utils/utils';
import { Schema } from '../schema';

export async function addJestPlugin(
  tree: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
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

  const jestTask = await jestInitGenerator(tree, {});
  tasks.push(jestTask);

  return runTasksInSerial(...tasks);
}
