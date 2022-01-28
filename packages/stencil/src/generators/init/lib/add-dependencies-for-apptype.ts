import { AppType, PROJECT_TYPE_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function addDependenciesByApptype(tree: Tree, appType: AppType) {
  const projectDependency = PROJECT_TYPE_DEPENDENCIES[appType];

  if (!projectDependency) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return addDependenciesToPackageJson(
    tree,
    projectDependency.dependencies,
    projectDependency.devDependencies
  );
}
