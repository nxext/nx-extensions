import { addDependenciesToPackageJson, Tree } from '@nxext/devkit';
import { viteVersion } from '../../../utils/version';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      vite: viteVersion,
    }
  );
}
