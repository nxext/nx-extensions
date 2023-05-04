import { InitSchema } from '../schema';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, Tree } from '@nx/devkit';

export function addStyledDependencies<T extends InitSchema>(
  tree: Tree,
  options: T
) {
  const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[options.style];

  if (!styleDependencies) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return addDependenciesToPackageJson(
    tree,
    styleDependencies.dependencies,
    styleDependencies.devDependencies
  );
}
