import {
  ensureNxProject,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
} from '@nrwl/nx-plugin/testing';

export function ensureNxProjectWithDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  optionalNpmPackages?: [npmPackageName: string, pluginDistPath: string][]
): void {
  ensureNxProject(npmPackageName, pluginDistPath);
  optionalNpmPackages.forEach(([npmPackageName, pluginDistPath]) =>
    patchPackageJsonForPlugin(npmPackageName, pluginDistPath)
  );
  runPackageManagerInstall();
}
