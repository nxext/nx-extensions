import { PROJECT_TYPE_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nrwl/devkit';

export function addE2eTestDependencies(
  tree: Tree
): GeneratorCallback[] {
  const testDependencies = PROJECT_TYPE_DEPENDENCIES['puppeteer'];
  const tasks: GeneratorCallback[] = [];

  if (testDependencies) {
    tasks.push(
      addDependenciesToPackageJson(
        tree,
        testDependencies.dependencies,
        testDependencies.devDependencies
      )
    );
  }

  return tasks;
}
