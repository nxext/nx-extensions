import { getPackageManagerCommand } from '@nrwl/devkit';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import {
  cleanupProject,
  getNxVersion,
  getSelectedPackageManager,
  packageInstall,
  runCreateWorkspace,
} from './index';
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
  packageManager = getSelectedPackageManager()
): string {
  cleanupProject();

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
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
    encoding: 'utf-8',
  });
  return install ? install.toString() : '';
}
