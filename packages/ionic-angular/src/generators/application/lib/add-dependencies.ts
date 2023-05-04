import {
  addDependenciesToPackageJson,
  NX_VERSION,
  readJson,
  Tree,
} from '@nx/devkit';
import { ionicAngularVersion } from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/angular': ionicAngularVersion,
    },
    { '@nx/angular': NX_VERSION }
  );
}
