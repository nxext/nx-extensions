import { jestInitGenerator } from '@nrwl/jest';
import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { hasNxPackage, readNxVersion } from './util';

export function addJestPlugin(tree: Tree, options): GeneratorCallback {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const hasNrwlJestDependency: boolean = hasNxPackage(tree, '@nrwl/jest');
  const nxVersion = readNxVersion(tree);

  const installTask: GeneratorCallback = hasNrwlJestDependency
    ? // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    : addDependenciesToPackageJson(tree, {}, { '@nrwl/jest': nxVersion });

  const jestTask = jestInitGenerator(tree, {});

  return async () => {
    await installTask();
    return jestTask();
  };
}
