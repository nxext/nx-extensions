import { addDependenciesToPackageJson, readJson, Tree } from '@nrwl/devkit';
import {
  ionicReactRouterVersion,
  ionicReactVersion,
  webVitalsVersion,
  workboxVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/react': ionicReactVersion,
      '@ionic/react-router': ionicReactRouterVersion,
      'web-vitals': webVitalsVersion,
      'workbox-background-sync': workboxVersion,
      'workbox-broadcast-update': workboxVersion,
      'workbox-cacheable-response': workboxVersion,
      'workbox-core': workboxVersion,
      'workbox-expiration': workboxVersion,
      'workbox-google-analytics': workboxVersion,
      'workbox-navigation-preload': workboxVersion,
      'workbox-precaching': workboxVersion,
      'workbox-range-requests': workboxVersion,
      'workbox-routing': workboxVersion,
      'workbox-strategies': workboxVersion,
      'workbox-streams': workboxVersion,
    },
    { '@nrwl/react': readNxVersion(host) }
  );
}

function readNxVersion(tree: Tree): string {
  const packageJson = readJson(tree, 'package.json');

  const nxVersion = packageJson.devDependencies['@nrwl/workspace']
    ? packageJson.devDependencies['@nrwl/workspace']
    : packageJson.dependencies['@nrwl/workspace'];

  if (!nxVersion) {
    throw new Error('@nrwl/workspace is not a dependency.');
  }

  return nxVersion;
}
