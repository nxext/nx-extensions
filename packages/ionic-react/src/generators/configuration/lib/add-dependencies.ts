import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  ionicReactRouterVersion,
  ionicReactVersion,
  ionIconsVersion,
  reactRouterVersion,
  reactVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/react': ionicReactVersion,
      '@ionic/react-router': ionicReactRouterVersion,
      ionicons: ionIconsVersion,

      '@capacitor/haptics': '6.0.1',
      '@capacitor/keyboard': '6.0.2',
      '@capacitor/status-bar': '6.0.1',

      /**
       * Following deps are overwrite because React Router v6 is not compatible with Ionic React Router
       */

      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router': '^5.3.4',
      'react-router-dom': '^5.3.4',
    },
    {
      '@types/react-router': '^5.1.20',
      '@types/react-router-dom': '^5.3.3',
      '@types/react': '^18.0.27',
      '@types/react-dom': '^18.0.10',
    }
  );
}
