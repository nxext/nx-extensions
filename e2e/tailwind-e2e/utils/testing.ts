import { patchPackageJsonForPlugin, runPackageManagerInstall, tmpProjPath } from '@nrwl/nx-plugin/testing';
import { ensureDirSync, removeSync } from 'fs-extra';
import { execSync } from 'child_process';

export function ensureNxProjectWithDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  optionalNpmPackages?: [npmPackageName: string, pluginDistPath: string][]
): void {
  ensureDirSync(tmpProjPath());

  removeSync(tmpProjPath());
  runNxNewCommand('', true);
  optionalNpmPackages.forEach(([npmPackageName, pluginDistPath]) => patchPackageJsonForPlugin(npmPackageName, pluginDistPath));
  patchPackageJsonForPlugin(npmPackageName, pluginDistPath);
  runPackageManagerInstall();
}

function runNxNewCommand(args?: string, silent?: boolean) {
  const localTmpDir = `./tmp/nx-e2e`;
  return execSync(
    `node ${require.resolve(
      '@nrwl/tao'
    )} new proj --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty ${
      args || ''
    }`,
    {
      cwd: localTmpDir,
      ...(silent && false ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    }
  );
}
