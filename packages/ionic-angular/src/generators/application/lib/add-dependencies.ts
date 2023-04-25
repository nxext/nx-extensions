import { addDependenciesToPackageJson, readJson, Tree } from '@nx/devkit';
import { ionicAngularVersion } from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/angular': ionicAngularVersion,
    },
    { '@nrwl/angular': readNxVersion(host) }
  );
}

function readNxVersion(tree: Tree): string {
  const packageJson = readJson(tree, 'package.json');

  const nxVersion = packageJson.devDependencies['@nx/workspace']
    ? packageJson.devDependencies['@nx/workspace']
    : packageJson.dependencies['@nx/workspace'];

  if (!nxVersion) {
    throw new Error('@nx/workspace is not a dependency.');
  }

  return nxVersion;
}
