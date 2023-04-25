import { readJson, Tree } from '@nx/devkit';

export function readNxVersion(tree: Tree): string {
  const packageJson = readJson(tree, 'package.json');

  const nxVersion = packageJson.devDependencies['@nx/workspace']
    ? packageJson.devDependencies['@nx/workspace']
    : packageJson.dependencies['@nx/workspace'];

  if (!nxVersion) {
    throw new Error('@nx/workspace is not a dependency.');
  }

  return nxVersion;
}

export function hasNxPackage(tree: Tree, nxPackage: string): boolean {
  const packageJson = readJson(tree, 'package.json');

  return (
    (packageJson.dependencies && packageJson.dependencies[nxPackage]) ||
    (packageJson.devDependencies && packageJson.devDependencies[nxPackage])
  );
}
