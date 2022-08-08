import { execSync } from 'child_process';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { getNxVersion, getPublishedVersion } from './index';
import { getPackageManagerCommand } from '@nrwl/devkit';
import { existsSync } from 'fs-extra';
import { join } from 'path';

function getNpmMajorVersion(): string {
  const [npmMajorVersion] = execSync(`npm -v`).toString().split('.');
  return npmMajorVersion;
}

export function getPackageManagerNxCommand({
  path = tmpProjPath(),
  packageManager = detectPackageManager(path),
} = {}): {
  createWorkspace: string;
  runNx: string;
} {
  const npmMajorVersion = getNpmMajorVersion();

  return {
    npm: {
      createWorkspace: `npx ${
        +npmMajorVersion >= 7 ? '--yes' : ''
      } create-nx-workspace@${getNxVersion()}`,
      runNx: `npx nx`,
    },
    yarn: {
      // `yarn create nx-workspace` is failing due to wrong global path
      createWorkspace: `yarn global add create-nx-workspace@${getNxVersion()} && create-nx-workspace`,
      runNx: `yarn nx`,
    },
    // Pnpm 3.5+ adds nx to
    pnpm: {
      createWorkspace: `pnpm dlx create-nx-workspace@${getNxVersion()}`,
      runNx: `pnpm exec nx`,
    },
  }[packageManager.trim()];
}

export function packageInstall(pkgs: string[], projName?: string) {
  const cwd = projName ? `${tmpProjPath()}/${projName}` : tmpProjPath();
  const pm = getPackageManagerCommand();
  const pkgsWithVersions = pkgs
    .map((pgk) => {
      const version = getPublishedVersion(pgk);
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

export function getSelectedPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  return (process.env.SELECTED_PM as 'npm' | 'yarn' | 'pnpm') || 'npm';
}

export declare type PackageManager = 'yarn' | 'pnpm' | 'npm';

export function detectPackageManager(dir = ''): PackageManager {
  return existsSync(join(dir, 'yarn.lock'))
    ? 'yarn'
    : existsSync(join(dir, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : 'npm';
}
