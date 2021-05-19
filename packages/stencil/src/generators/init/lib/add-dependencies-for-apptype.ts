import { AppType, PROJECT_TYPE_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function addDependenciesByApptype(host: Tree, appType: AppType) {
  const projectDependency = PROJECT_TYPE_DEPENDENCIES[appType];

  return addDependenciesToPackageJson(
    host,
    projectDependency.dependencies,
    projectDependency.devDependencies
  );
}
