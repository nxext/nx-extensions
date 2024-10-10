import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  ionicReactRouterVersion,
  ionicReactVersion,
  ionIconsVersion,
  reactRouterVersion,
  capacitorPluginsVersion,
  reactRouterDomTypesVersion,
  reactRouterTypesVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/react': ionicReactVersion,
      '@ionic/react-router': ionicReactRouterVersion,
      ionicons: ionIconsVersion,
      '@capacitor/haptics': capacitorPluginsVersion,
      '@capacitor/keyboard': capacitorPluginsVersion,
      '@capacitor/status-bar': capacitorPluginsVersion,
      /**
       * Following deps are overwrite because React Router v6 is not compatible with Ionic React Router
       */
      'react-router': reactRouterVersion,
      'react-router-dom': reactRouterVersion,
    },
    {
      '@types/react-router': reactRouterTypesVersion,
      '@types/react-router-dom': reactRouterDomTypesVersion,
    }
  );
}
