import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  runTasksInSerial,
} from '@nx/devkit';
import { hasNxPackage, readNxVersion } from '../../utils/utils';
import { cypressInitGenerator } from '@nx/cypress';
import { Schema } from '../schema';

export async function addCypressPlugin(
  tree: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const tasks: GeneratorCallback[] = [];
  const hasNrwlCypressDependency: boolean = hasNxPackage(tree, '@nx/cypress');

  if (!hasNrwlCypressDependency) {
    const nxVersion = readNxVersion(tree);

    const installTask = addDependenciesToPackageJson(
      tree,
      {},
      { '@nx/cypress': nxVersion }
    );
    tasks.push(installTask);
  }

  const cypressTask = await cypressInitGenerator(tree, {});
  tasks.push(cypressTask);

  return runTasksInSerial(...tasks);
}
