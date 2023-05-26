import { addDependenciesToPackageJson, NX_VERSION, Tree } from '@nx/devkit';
import { ionicAngularVersion, ioniconsVersion } from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/angular': ionicAngularVersion,
      ionicons: ioniconsVersion,
    },
    { '@nx/angular': NX_VERSION }
  );
}
