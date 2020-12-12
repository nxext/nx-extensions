import { InitSchema } from '../schema';
import { noop, Rule } from '@angular-devkit/schematics';
import { PROJECT_TYPE_DEPENDENCIES } from '../../../utils/typings';
import { addDepsToPackageJson } from '@nrwl/workspace';

export function addE2eDependencies<T extends InitSchema>(options: T): Rule {
  const testDependencies = PROJECT_TYPE_DEPENDENCIES['e2e'];

  return testDependencies
    ? addDepsToPackageJson(
      testDependencies.dependencies,
      testDependencies.devDependencies
    )
    : noop();
}
