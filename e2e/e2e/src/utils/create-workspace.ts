import { getNxWorkspaceCommands } from './package-manager';
import { dirname } from 'path';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { PackageManager } from '@nx/devkit';
import { execSync } from 'child_process';

export function runCreateWorkspace(
  name: string,
  {
    preset,
    packageManager,
    extraArgs,
    useDetectedPm = false,
  }: {
    preset: string;
    packageManager?: PackageManager;
    extraArgs?: string;
    useDetectedPm?: boolean;
  }
) {
  const nxpm = getNxWorkspaceCommands({ packageManager });
  const localTmpDir = dirname(tmpProjPath());
  let command = `${nxpm.createWorkspace} ${name} --preset=${preset} --no-nxCloud --no-interactive`;
  if (packageManager && !useDetectedPm) {
    command += ` --package-manager=${packageManager}`;
  }

  if (extraArgs) {
    command += ` ${extraArgs}`;
  }

  const create = execSync(command, {
    cwd: localTmpDir,
    stdio: [0, 1, 2],
    env: process.env,
    encoding: 'utf-8',
  });
  return create ? create.toString() : '';
}
