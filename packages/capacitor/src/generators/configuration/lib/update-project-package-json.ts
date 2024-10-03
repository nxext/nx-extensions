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
  const projectPackageJsonPath = normalizePath(
    `${options.projectRoot}/package.json`
  );
  const rootPath = offsetFromRoot(options.projectRoot);
  const isRoot = rootPath === './';
  const capacitorDependencies = {
    '@capacitor/ios': isRoot ? capacitorVersion : `${rootPath}node_modules/@capacitor/ios`,
    '@capacitor/android': isRoot ? capacitorVersion : `${rootPath}node_modules/@capacitor/android`,
  };
  const capacitorDevDependencies = {
    '@capacitor/cli': capacitorVersion,
  };

  if (host.exists(projectPackageJsonPath)) {
    updateJson(host, projectPackageJsonPath, (json) => ({
      ...json,
      dependencies: {
        ...json.dependencies,
        ...capacitorDependencies,
      },
      devDependencies: {
        ...json.devDependencies,
        ...capacitorDevDependencies,
      },
    }));
  } else {
    writeJson(host, projectPackageJsonPath, {
      name: options.project,
      dependencies: capacitorDependencies,
      devDependencies: capacitorDevDependencies,
    });
  }
}
