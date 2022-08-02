import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { existsSync, readFileSync, removeSync, writeFileSync } from 'fs-extra';
import { execSync } from 'child_process';
import { logger, parseJson, readJsonFile } from '@nrwl/devkit';
import { dirname, join } from 'path';
import * as glob from 'glob';
import { getPackageManagerNxCommand } from './package-manager';

export { killPort } from './kill';
export { newProject } from './new-project';
export { packageInstall } from './package-manager';

process.env.npm_config_registry = `http://localhost:4872/`;
process.env.YARN_REGISTRY = process.env.npm_config_registry;

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

export function getPublishedVersion(pkg: string): string {
  const pkgName = pkg.replace('@nxext/', '');
  process.env.PUBLISHED_VERSION =
    process.env.PUBLISHED_VERSION ||
    // read version of built nx package
    readJsonFile(`./dist/packages/${pkgName}/package.json`).version ||
    // fallback to latest if built nx package is missing
    'latest';
  return process.env.PUBLISHED_VERSION;
}

export function getNxVersion(): string {
  return (
    readJsonFile(`${process.cwd()}/package.json`).devDependencies[
      '@nrwl/workspace'
    ] || 'latest'
  );
}

// Useful in order to cleanup space during CI to prevent `No space left on device` exceptions
export function cleanupProject() {
  const tmpDir = tmpProjPath();
  if (existsSync(tmpDir)) {
    removeSync(tmpDir);
  }
}

export function cleanupAll() {
  const tmpRegistryDir = join(process.cwd(), 'tmp/local-registry');
  cleanupProject();
  if (existsSync(tmpRegistryDir)) {
    removeSync(tmpRegistryDir);
  }
}

function currentCli() {
  return process.env.SELECTED_CLI || 'nx';
}

export declare type PackageManager = 'yarn' | 'pnpm' | 'npm';

export function detectPackageManager(dir = ''): PackageManager {
  return existsSync(join(dir, 'yarn.lock'))
    ? 'yarn'
    : existsSync(join(dir, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : 'npm';
}

export function readJson(f: string): any {
  const content = readFile(f);
  return parseJson(content);
}

export function readFile(f: string) {
  const ff = f.startsWith('/') ? f : tmpProjPath(f);
  return readFileSync(ff, 'utf-8');
}

export function updatePackageJsonFiles(version, isLocal) {
  logger.info('Update versions...');
  let pkgFiles = glob.sync('dist/packages/**/package.json');

  if (isLocal) {
    pkgFiles = pkgFiles.filter((f) => f !== 'package.json');
  }
  pkgFiles.forEach((p) => {
    const content = JSON.parse(readFileSync(p).toString());
    content.version = version;
    for (const key in content.dependencies) {
      if (key.startsWith('@nxext/')) {
        content.dependencies[key] = version;
      }
    }
    writeFileSync(p, JSON.stringify(content, null, 2));
  });
}

export function getSelectedPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  return (process.env.SELECTED_PM as 'npm' | 'yarn' | 'pnpm') || 'npm';
}
