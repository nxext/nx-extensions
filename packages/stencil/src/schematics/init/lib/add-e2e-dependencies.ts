import { InitSchema } from '../schema';
import { PROJECT_TYPE_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nrwl/devkit';

export function addE2eTestDependencies<T extends InitSchema>(tree: Tree): GeneratorCallback[] {
  const testDependencies = PROJECT_TYPE_DEPENDENCIES['e2e'];
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
