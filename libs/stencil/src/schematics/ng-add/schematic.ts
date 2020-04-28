import { chain, Rule } from '@angular-devkit/schematics';
import { PROJECT_TYPE_DEPENDENCIES } from '../../utils/typings';
import { addDepsToPackageJson } from '@nrwl/workspace';

export default function(): Rule {
  const projectDependency = PROJECT_TYPE_DEPENDENCIES['init'];
  return chain([
    addDepsToPackageJson(
      projectDependency.dependencies,
      projectDependency.devDependencies
    )
  ]);
}
