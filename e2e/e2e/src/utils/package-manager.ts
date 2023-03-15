import { execSync } from 'child_process';
import { tmpProjPath } from '@nx/plugin/testing';
import { getNxVersion, deployedVersion } from './index';
import {
  detectPackageManager,
  getPackageManagerCommand,
  getPackageManagerVersion,
} from '@nx/devkit';

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

export function packageInstallAsDevDependency(
  pkgs: string[],
  projName?: string
) {
  const verdaccioUrl = `http://localhost:4872/`;
  const cwd = projName ? `${tmpProjPath()}/${projName}` : tmpProjPath();
  const pm = getPackageManagerCommand();
  const pkgsWithVersions = pkgs
    .map((pkg: string) => {
      if (!pkg.includes('@')) {
        return `${pkg}@${deployedVersion}`;
      } else {
        return pkg;
      }
    })
    .join(' ');
  const install = execSync(
    `${pm.addDev} ${pkgsWithVersions} --registry ${verdaccioUrl}`,
    {
      cwd,
      stdio: [0, 1, 2],
      env: process.env,
      encoding: 'utf-8',
    }
  );
  return install ?? '';
}
