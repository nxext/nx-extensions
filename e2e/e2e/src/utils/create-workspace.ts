import { getPackageManagerNxCommand } from './package-manager';
import { dirname } from 'path';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { execSync } from 'child_process';

export function runCreateWorkspace(
  name: string,
  {
    preset,
    packageManager,
    cli,
    extraArgs,
    useDetectedPm = false,
  }: {
    preset: string;
    packageManager?: 'npm' | 'yarn' | 'pnpm';
    cli?: string;
    extraArgs?: string;
    useDetectedPm?: boolean;
  }
) {
  const nxpm = getPackageManagerNxCommand({ packageManager });
  const localTmpDir = dirname(tmpProjPath());
  let command = `${nxpm.createWorkspace} ${name} --cli=${
    cli || currentCli()
  } --preset=${preset} --no-nxCloud --no-interactive`;
  if (packageManager && !useDetectedPm) {
    command += ` --package-manager=${packageManager}`;
  }

  if (extraArgs) {
    command += ` ${extraArgs}`;
  }

  const create = execSync(command, {
    cwd: localTmpDir,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
    encoding: 'utf-8',
  });
  return create ? create.toString() : '';
}

function currentCli() {
  return process.env.SELECTED_CLI || 'nx';
}
