import { detectPackageManager, getPackageManagerCommand } from '@nrwl/devkit';
import { tmpProjPath, cleanup } from '@nrwl/nx-plugin/testing';
import { getNxVersion, packageInstall, runCreateWorkspace } from './index';
import { execSync } from 'child_process';
import { logError, logInfo } from './logger';

/**
 * Sets up a new project in the temporary project path
 * for the currently selected CLI.
 */
export function newProject(
  packagesToInstall: string[],
  nxPackagesToInstall?: string[],
  name = 'proj',
  packageManager = detectPackageManager()
): string {
  cleanup();

  try {
    runCreateWorkspace(name, {
      preset: 'empty',
      packageManager,
    });
    addNxPackages(nxPackagesToInstall);
    packageInstall(packagesToInstall);

    logInfo(`creating the test workspace...`);
    return name;
  } catch (e) {
    logError(`Failed to set up project for e2e tests.`, e.message);
    throw e;
  }
}

export function newProjectWithPreset(
  preset: string,
  params?: string,
  name = 'proj',
  packageManager = detectPackageManager()
): string {
  cleanup();

  try {
    runCreateWorkspace(name, {
      preset: preset,
      extraArgs: params,
      packageManager,
    });

    logInfo(`creating the test workspace with preset "${preset}"...`);
    return name;
  } catch (e) {
    logError(`Failed to set up project for e2e tests.`, e.message);
    throw e;
  }
}

function addNxPackages(pkgs: string[], projName?: string) {
  if (pkgs == null || pkgs.length == 0) return;

  const cwd = projName ? `${tmpProjPath()}/${projName}` : tmpProjPath();
  const pm = getPackageManagerCommand();
  const pkgsWithVersions = pkgs
    .map((pgk) => {
      const version = getNxVersion();
      return `${pgk}@${version}`;
    })
    .join(' ');
  const install = execSync(`${pm.addDev} ${pkgsWithVersions}`, {
    cwd,
    stdio: [0, 1, 2],
    env: process.env,
    encoding: 'utf-8',
  });
  return install ?? '';
}
