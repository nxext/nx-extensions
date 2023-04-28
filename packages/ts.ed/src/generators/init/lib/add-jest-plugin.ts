import { jestInitGenerator } from '@nx/jest';
import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  runTasksInSerial,
} from '@nx/devkit';
import { hasNxPackage, readNxVersion } from './util';

export async function addJestPlugin(tree: Tree): Promise<GeneratorCallback> {
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
