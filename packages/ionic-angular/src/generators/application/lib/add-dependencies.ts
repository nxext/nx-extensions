import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import { ionicAngularVersion, nxVersion } from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/angular': ionicAngularVersion,
    },
    { '@nrwl/angular': nxVersion }
  );
}
