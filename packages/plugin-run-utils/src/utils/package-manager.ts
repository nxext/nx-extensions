import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import * as path from 'path';
import { gte, lt } from 'semver';

export interface PackageManagerCommands {
  install: string;
  ciInstall: string;
  add: string;
  addDev: string;
  addGlobal: string;
  rm: string;
  exec: string;
  list: string;
  run: (script: string, args: string) => string;
}

export type PackageManager = 'yarn' | 'pnpm' | 'npm';
export function installPackagesTask(
  tree,
  alwaysRun = false,
  cwd = '',
  packageManager: PackageManager = detectPackageManager(cwd)
): void {
  if (
    !tree
      .listChanges()
      .find((f) => f.path === joinPathFragments(cwd, 'package.json')) &&
    !alwaysRun
  ) {
    return;
  }

  const packageJsonValue = tree.read(
    joinPathFragments(cwd, 'package.json'),
    'utf-8'
  );
  const storedPackageJsonValue: string = global['__packageJsonInstallCache__'];
  // Don't install again if install was already executed with package.json
  if (storedPackageJsonValue != packageJsonValue || alwaysRun) {
    global['__packageJsonInstallCache__'] = packageJsonValue;
    const pmc = getPackageManagerCommand(packageManager);
    execSync(pmc.install, {
      cwd: join(tree.root, cwd),
      stdio: [0, 1, 2],
    });
  }
}

export function detectPackageManager(dir = ''): PackageManager {
  return existsSync(join(dir, 'yarn.lock'))
    ? 'yarn'
    : existsSync(join(dir, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : 'npm';
}

export function getPackageManagerCommand(
  packageManager: PackageManager = detectPackageManager()
): PackageManagerCommands {
  const commands: { [pm in PackageManager]: () => PackageManagerCommands } = {
    yarn: () => ({
      install: 'yarn',
      ciInstall: 'yarn --frozen-lockfile',
      add: 'yarn add -W',
      addDev: 'yarn add -D -W',
      addGlobal: 'yarn global add',
      rm: 'yarn remove',
      exec: 'yarn',
      run: (script: string, args: string) => `yarn ${script} ${args}`,
      list: 'yarn list',
    }),
    pnpm: () => {
      const pnpmVersion = getPackageManagerVersion('pnpm');
      const useExec = gte(pnpmVersion, '6.13.0');
      const includeDoubleDashBeforeArgs = lt(pnpmVersion, '7.0.0');
      const isPnpmWorkspace = existsSync('pnpm-workspace.yaml');

      return {
        install: 'pnpm install --no-frozen-lockfile', // explicitly disable in case of CI
        ciInstall: 'pnpm install --frozen-lockfile',
        add: isPnpmWorkspace ? 'pnpm add -w' : 'pnpm add',
        addDev: isPnpmWorkspace ? 'pnpm add -Dw' : 'pnpm add -D',
        addGlobal: 'pnpm add -g',
        rm: 'pnpm rm',
        exec: useExec ? 'pnpm exec' : 'pnpx',
        run: (script: string, args: string) =>
          includeDoubleDashBeforeArgs
            ? `pnpm run ${script} -- ${args}`
            : `pnpm run ${script} ${args}`,
        list: 'pnpm ls --depth 100',
      };
    },
    npm: () => {
      process.env['npm_config_legacy_peer_deps'] ??= 'true';

      return {
        install: 'npm install',
        ciInstall: 'npm ci',
        add: 'npm install',
        addDev: 'npm install -D',
        addGlobal: 'npm install -g',
        rm: 'npm rm',
        exec: 'npx',
        run: (script: string, args: string) => `npm run ${script} -- ${args}`,
        list: 'npm ls',
      };
    },
  };

  return commands[packageManager]();
}

export function getPackageManagerVersion(
  packageManager: PackageManager = detectPackageManager()
): string {
  return execSync(`${packageManager} --version`).toString('utf-8').trim();
}

function removeWindowsDriveLetter(osSpecificPath: string): string {
  return osSpecificPath.replace(/^[A-Z]:/, '');
}

/**
 * Coverts an os specific path to a unix style path
 */
export function normalizePath(osSpecificPath: string): string {
  return removeWindowsDriveLetter(osSpecificPath).split('\\').join('/');
}

/**
 * Normalized path fragments and joins them
 */
export function joinPathFragments(...fragments: string[]): string {
  return normalizePath(path.join(...fragments));
}
