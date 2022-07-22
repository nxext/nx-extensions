import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import {
  ionicReactRouterVersion,
  ionicReactVersion,
  nxVersion,
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
    { '@nrwl/react': nxVersion }
  );
}
