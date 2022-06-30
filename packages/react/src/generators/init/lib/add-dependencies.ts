import { addDependenciesToPackageJson, Tree } from '@nxext/devkit';
import { vitePluginReactVersion } from '../../utils/versions';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    { '@vitejs/plugin-react': vitePluginReactVersion }
  );
}
