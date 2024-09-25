import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  ionicReactRouterVersion,
  ionicReactVersion,
  webVitalsVersion,
  workboxVersion,
  capacitorPluginVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/react': ionicReactVersion,
      '@ionic/react-router': ionicReactRouterVersion,
      'web-vitals': webVitalsVersion,
      '@capacitor/haptics': capacitorPluginVersion,
      '@capacitor/keyboard': capacitorPluginVersion,
      '@capacitor/status-bar': capacitorPluginVersion,
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
    {}
  );
}
