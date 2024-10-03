import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  capacitorPluginsVersion,
  ionicAngularVersion,
  ioniconsVersion,
} from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@ionic/angular': ionicAngularVersion,
      ionicons: ioniconsVersion,
      '@capacitor/haptics': capacitorPluginsVersion,
      '@capacitor/keyboard': capacitorPluginsVersion,
      '@capacitor/status-bar': capacitorPluginsVersion,
    },
    {}
  );
}
