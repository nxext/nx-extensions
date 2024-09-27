import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  ionicReactRouterVersion,
  ionicReactVersion,
  ionIconsVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/react': ionicReactVersion,
      '@ionic/react-router': ionicReactRouterVersion,
      ionicons: ionIconsVersion,
    },
    {}
  );
}
