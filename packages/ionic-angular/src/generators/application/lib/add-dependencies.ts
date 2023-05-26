import { addDependenciesToPackageJson, NX_VERSION, Tree } from '@nx/devkit';
import {
  ionicAngularVersion,
  ioniconsVersion,
  capacitorPluginVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/angular': ionicAngularVersion,
      ionicons: ioniconsVersion,
      '@capacitor/haptics': capacitorPluginVersion,
      '@capacitor/keyboard': capacitorPluginVersion,
      '@capacitor/status-bar': capacitorPluginVersion,
    },
    { '@nx/angular': NX_VERSION }
  );
}
