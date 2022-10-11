import { readJson, Tree } from '@nrwl/devkit';

export function readNxVersion(tree: Tree): string {
  const packageJson = readJson(tree, 'package.json');

  const nxVersion = packageJson.devDependencies['@nrwl/workspace']
    ? packageJson.devDependencies['@nrwl/workspace']
    : packageJson.dependencies['@nrwl/workspace'];

  if (!nxVersion) {
    throw new Error('@nrwl/workspace is not a dependency.');
  }

  return nxVersion;
}
