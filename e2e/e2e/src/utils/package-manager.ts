import { execSync } from 'child_process';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { getNxVersion, getPublishedVersion } from './index';
import {
  detectPackageManager,
  getPackageManagerCommand,
  getPackageManagerVersion,
  joinPathFragments,
  PackageManager,
  readNxJson,
} from '@nrwl/devkit';

export function getNxWorkspaceCommands({
  path = tmpProjPath(),
  packageManager = detectPackageManager(path),
} = {}): {
  createWorkspace: string;
} {
  const npmMajorVersion = getPackageManagerVersion();

  return {
    npm: {
      createWorkspace: `npx ${
        +npmMajorVersion >= 7 ? '--yes' : ''
      } create-nx-workspace@${getNxVersion()}`,
    },
    yarn: {
      // `yarn create nx-workspace` is failing due to wrong global path
      createWorkspace: `yarn global add create-nx-workspace@${getNxVersion()} && create-nx-workspace`,
    },
    // Pnpm 3.5+ adds nx to
    pnpm: {
      createWorkspace: `pnpm dlx create-nx-workspace@${getNxVersion()}`,
    },
  }[packageManager];
}

export function packageInstall(pkgs: string[], projName?: string) {
  const nxJson = readNxJson();
  const distDir = joinPathFragments('dist', nxJson.workspaceLayout.libsDir);
  const cwd = projName ? `${tmpProjPath()}/${projName}` : tmpProjPath();
  const pm = getPackageManagerCommand();
  const pkgsWithVersions = pkgs
    .map((pgk) => {
      const version = getPublishedVersion(pgk, distDir);
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

export function getSelectedPackageManager(): PackageManager {
  return (process.env.SELECTED_PM as 'npm' | 'yarn' | 'pnpm') || 'npm';
}
