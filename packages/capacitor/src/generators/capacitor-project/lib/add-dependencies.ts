import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import { capacitorVersion } from '../../../utils/versions';

export function addDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@capacitor/core': capacitorVersion,
    },
    {
      '@capacitor/android': capacitorVersion,
      '@capacitor/ios': capacitorVersion,
      '@capacitor/cli': capacitorVersion,
    }
  );
}
