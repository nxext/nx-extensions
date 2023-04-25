import { readJson, Tree } from '@nx/devkit';

export function readNxVersion(host: Tree): string {
  const packageJson = readJson(host, 'package.json');

  const nxVersion = packageJson.devDependencies['@nx/workspace']
    ? packageJson.devDependencies['@nx/workspace']
    : packageJson.dependencies['@nx/workspace'];

  if (!nxVersion) {
    throw new Error('@nx/workspace is not a dependency.');
  }

  return nxVersion;
}
