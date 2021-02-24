import { Tree, updateJson } from '@nrwl/devkit';

export function moveNxextToDevDependencies(tree: Tree) {
  updateJson(tree, '/package.json', (packageJson) => {
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};

    if (packageJson.dependencies['@nxext/stencil']) {
      packageJson.devDependencies['@nxext/stencil'] =
        packageJson.dependencies['@nxext/stencil'];
      delete packageJson.dependencies['@nxext/stencil'];
    }
    return packageJson;
  })
}
