import { tmpProjPath, uniq } from '@nrwl/nx-plugin/testing';
import {
  ensureDirSync,
  existsSync,
  readFileSync,
  removeSync,
  statSync,
  writeFileSync,
} from 'fs-extra';
import { execSync } from 'child_process';
import { parseJson, readJsonFile } from '@nrwl/devkit';
import * as isCI from 'is-ci';
import { PackageManager } from 'nx/src/utils/package-manager';
import { dirname, join } from 'path';
import { Workspaces } from 'nx/src/config/workspaces';
import * as path from 'path';
import * as glob from 'glob';
import { logError, logInfo } from './logger';

export const registry = `http://localhost:4873/`;
process.env.npm_config_registry = registry;
process.env.YARN_REGISTRY = process.env.npm_config_registry;

/**
 * Sets up a new project in the temporary project path
 * for the currently selected CLI.
 */
export function newProject(
  nxextPackagesToInstall: string[],
  nxPackagesToInstall?: string[],
  name = uniq('proj')
): string {
  try {
    cleanupProject();
    runNxNewCommand();
    addNxPackages(nxPackagesToInstall);
    packageInstall(nxextPackagesToInstall);

    logInfo(`E2E test is creating a project: ${tmpProjPath()}`);
    return name;
  } catch (e) {
    logError(`Failed to set up project for e2e tests.`, e.message);
    throw e;
  }
}

export function packageInstall(pkgs: string[], projName?: string) {
  const cwd = projName ? `${tmpProjPath()}/${projName}` : tmpProjPath();
  const pm = getPackageManagerCommand({ path: cwd });
  const pkgsWithVersions = pkgs
    .map((pgk) => {
      const version = getPublishedVersion(pgk);
      return `${pgk}@${version}`;
    })
    .join(' ');
  const install = execSync(`${pm.addDev} ${pkgsWithVersions}`, {
    cwd,
    // stdio: [0, 1, 2],
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
    encoding: 'utf-8',
  });
  return install ? install.toString() : '';
}

function addNxPackages(pkgs: string[]) {
  if (pkgs == null || pkgs.length == 0) return;

  const cwd = tmpProjPath();
  const pm = getPackageManagerCommand({ path: cwd });
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

function runNxNewCommand(args?: string, silent?: boolean) {
  const localTmpDir = dirname(tmpProjPath());
  return execSync(
    `node ${require.resolve(
      'nx'
    )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty ${
      args || ''
    }`,
    {
      cwd: localTmpDir,
      // eslint-disable-next-line no-constant-condition
      ...(silent && false ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    }
  );
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
  removeSync(tmpProjPath());
}

export function cleanupAll() {
  cleanupProject();
  removeSync(`${process.cwd()}/tmp/local-registry`);
}

function getNpmMajorVersion(): string {
  const [npmMajorVersion] = execSync(`npm -v`).toString().split('.');
  return npmMajorVersion;
}

export function getPackageManagerCommand({
  path = tmpProjPath(),
  packageManager = detectPackageManager(path),
} = {}): {
  createWorkspace: string;
  run: (script: string, args: string) => string;
  runNx: string;
  runNxSilent: string;
  runUninstalledPackage?: string | undefined;
  addDev: string;
  list: string;
} {
  const npmMajorVersion = getNpmMajorVersion();

  return {
    npm: {
      createWorkspace: `npx ${
        +npmMajorVersion >= 7 ? '--yes' : ''
      } create-nx-workspace@${getNxVersion()}`,
      run: (script: string, args: string) => `npm run ${script} -- ${args}`,
      runNx: `npx nx`,
      runNxSilent: `npx nx`,
      runUninstalledPackage: `npx --yes`,
      addDev: `npm install --legacy-peer-deps -D --registry=${registry}`,
      list: 'npm ls --depth 10',
    },
    yarn: {
      // `yarn create nx-workspace` is failing due to wrong global path
      createWorkspace: `yarn global add create-nx-workspace@${getNxVersion()} && create-nx-workspace`,
      run: (script: string, args: string) => `yarn ${script} ${args}`,
      runNx: `yarn nx`,
      runNxSilent: `yarn --silent nx`,
      runUninstalledPackage: 'npx --yes',
      addDev: `yarn add -D`,
      list: 'npm ls --depth 10',
    },
    // Pnpm 3.5+ adds nx to
    pnpm: {
      createWorkspace: `pnpm dlx create-nx-workspace@${getNxVersion()}`,
      run: (script: string, args: string) => `pnpm run ${script} -- ${args}`,
      runNx: `pnpm exec nx`,
      runNxSilent: `pnpm exec nx`,
      runUninstalledPackage: 'pnpm dlx',
      addDev: `pnpm add -D`,
      list: 'npm ls --depth 10',
    },
  }[packageManager.trim()];
}

function currentCli() {
  return process.env.SELECTED_CLI || 'nx';
}

export function detectPackageManager(dir = ''): PackageManager {
  return existsSync(join(dir, 'yarn.lock'))
    ? 'yarn'
    : existsSync(join(dir, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : 'npm';
}

/**
 * Remove log colors for fail proof string search
 * @param log
 * @returns
 */
function stripConsoleColors(log: string): string {
  return log.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

interface RunCmdOpts {
  silenceError?: boolean;
  env?: Record<string, string>;
  cwd?: string;
  silent?: boolean;
}

export function runCLI(
  command?: string,
  opts: RunCmdOpts = {
    silenceError: false,
    env: null,
  }
): string {
  try {
    const pm = getPackageManagerCommand();
    const r = stripConsoleColors(
      execSync(`${pm.runNx} ${command}`, {
        cwd: opts.cwd || tmpProjPath(),
        env: { ...(opts.env || process.env) },
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024,
      })
    );
    if (process.env.NX_VERBOSE_LOGGING) {
      logInfo(`result of running: ${command}`, r);
    }

    const needsMaxWorkers = /g.*(express|nest|node|web|react):app.*/;
    if (needsMaxWorkers.test(command)) {
      setMaxWorkers();
    }

    return r;
  } catch (e) {
    if (opts.silenceError) {
      return stripConsoleColors(e.stdout?.toString() + e.stderr?.toString());
    } else {
      logError(
        `Original command: ${command}`,
        `${e.stdout?.toString()}\n\n${e.stderr?.toString()}`
      );
      throw e;
    }
  }
}

/**
 * Sets maxWorkers in CI on all projects that require it
 * so that it doesn't try to run it with 34 workers
 *
 * maxWorkers required for: node, web, jest
 */
function setMaxWorkers() {
  if (isCI) {
    const ws = new Workspaces(tmpProjPath());
    const workspaceFile = workspaceConfigName();
    const workspaceFileExists = fileExists(tmpProjPath(workspaceFile));
    const workspace = ws.readWorkspaceConfiguration();
    const rawWorkspace = workspaceFileExists ? readJson(workspaceFile) : null;
    let requireWorkspaceFileUpdate = false;

    Object.keys(workspace.projects).forEach((appName) => {
      const project = workspace.projects[appName];
      const { build } = project.targets;

      if (!build) {
        return;
      }

      const executor = build.executor;
      if (
        executor.startsWith('@nrwl/node') ||
        executor.startsWith('@nrwl/web') ||
        executor.startsWith('@nrwl/jest')
      ) {
        build.options.maxWorkers = 4;
      }

      if (
        !workspaceFileExists ||
        typeof rawWorkspace.projects[appName] === 'string'
      ) {
        updateFile(
          join(project.root, 'project.json'),
          JSON.stringify(project, null, 2)
        );
      } else {
        requireWorkspaceFileUpdate = true;
      }
    });
    if (workspaceFileExists && requireWorkspaceFileUpdate) {
      updateFile(workspaceFile, JSON.stringify(workspace));
    }
  }
}

export function workspaceConfigName() {
  return currentCli() === 'angular' ? 'angular.json' : 'workspace.json';
}

export function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

export function updateFile(
  f: string,
  content: string | ((content: string) => string)
): void {
  ensureDirSync(path.dirname(tmpProjPath(f)));
  if (typeof content === 'string') {
    writeFileSync(tmpProjPath(f), content);
  } else {
    writeFileSync(
      tmpProjPath(f),
      content(readFileSync(tmpProjPath(f)).toString())
    );
  }
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
  logInfo('Update versions...');
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
