import {
  normalizePath,
  offsetFromRoot,
  Tree,
  updateJson,
  writeJson,
} from '@nx/devkit';
import { capacitorVersion } from '../../../utils/versions';
import { NormalizedSchema } from '../schema';

export function updateProjectPackageJson(
  host: Tree,
  options: NormalizedSchema
) {
  const projectPackageJson = normalizePath(
    options.projectRoot + '/package.json'
  );
  if (host.exists(projectPackageJson)) {
    updateJson(host, projectPackageJson, (json) => {
      return {
        ...json,
        devDependencies: {
          ...json.devDependencies,
          '@capacitor/cli': capacitorVersion,
          '@capacitor/ios': `${offsetFromRoot(
            options.projectRoot
          )}node_modules/@capacitor/ios`,
          '@capacitor/android': `${offsetFromRoot(
            options.projectRoot
          )}node_modules/@capacitor/android`,
        },
      };
    });
  } else {
    writeJson(host, projectPackageJson, {
      name: options.project,
      devDependencies: {
        '@capacitor/cli': capacitorVersion,
        '@capacitor/ios': `${offsetFromRoot(
          options.projectRoot
        )}node_modules/@capacitor/ios`,
        '@capacitor/android': `${offsetFromRoot(
          options.projectRoot
        )}node_modules/@capacitor/android`,
      },
    });
  }
}
