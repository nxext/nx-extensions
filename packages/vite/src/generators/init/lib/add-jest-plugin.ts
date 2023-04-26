import { jestInitGenerator } from '@nx/jest';
import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  runTasksInSerial,
} from '@nx/devkit';
import { hasNxPackage, readNxVersion } from './util';

export async function addJestPlugin(
  tree: Tree,
  options
): Promise<GeneratorCallback> {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const hasNrwlJestDependency: boolean = hasNxPackage(tree, '@nx/jest');
  const nxVersion = readNxVersion(tree);

  const installTask: GeneratorCallback = hasNrwlJestDependency
    ? // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    : addDependenciesToPackageJson(tree, {}, { '@nx/jest': nxVersion });

  const jestTask = await jestInitGenerator(tree, {});

  return async () => {
    await installTask();
    return await jestTask();
  };
}
