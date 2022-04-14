import {
  cleanup,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
  tmpProjPath,
} from '@nrwl/nx-plugin/testing';
import { readJsonFile, writeJsonFile } from '@nrwl/devkit';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { ensureDirSync } from 'fs-extra';
import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export function ensureNxProjectAndPrepareDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  optionalNpmPackages?: Record<string, string>
): void {
  ensureNxProject(npmPackageName, pluginDistPath);

  patchPackageJsonFromDependencies(
    npmPackageName,
    pluginDistPath,
    optionalNpmPackages
  );

  runPackageManagerInstall();
}

export function ensureNxProjectWithDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  optionalNpmPackages?: [npmPackageName: string, pluginDistPath: string][]
): void {
  ensureNxProject(npmPackageName, pluginDistPath);
  optionalNpmPackages.forEach(([npmPackageName, pluginDistPath]) =>
    patchPackageJsonForPlugin(npmPackageName, pluginDistPath)
  );

  runPackageManagerInstall();
}

function patchPackageJsonFromDependencies(
  npmPackageName: string,
  distPath: string,
  optionalNpmPackages?: Record<string, string>
) {
  const path = `${process.cwd()}/${distPath}/package.json`;
  const json: PackageJson = readJsonFile(path);

  const deps = Object.keys(json.dependencies).reduce<Record<string, string>>(
    (acc, cur) => {
      if (cur.startsWith('@nxext/')) {
        if (optionalNpmPackages[cur]) {
          acc[cur] = `file:${workspaceRoot}/${optionalNpmPackages[cur]}`;
          patchPackageJsonFromDependencies(
            cur,
            optionalNpmPackages[cur],
            optionalNpmPackages
          );
        } else {
          acc[cur] = json.dependencies[cur];
        }
      } else {
        acc[cur] = json.dependencies[cur];
      }

      return acc;
    },
    {} as Record<string, string>
  );

  json.dependencies = deps;

  writeJsonFile(path, json);
}

/**
 * Creates a new nx project in the e2e directory
 *
 * @param npmPackageName package name to test
 * @param pluginDistPath dist path where the plugin was outputted to
 */
export function newNxProject(
  npmPackageName: string,
  pluginDistPath: string
): void {
  cleanup();
  runNxNewCommand('', true);
  patchPackageJsonForPlugin(npmPackageName, pluginDistPath);
}

/**
 * Ensures that a project has been setup in the e2e directory
 * It will also copy `@nrwl` packages to the e2e directory
 */
export function ensureNxProject(
  npmPackageName?: string,
  pluginDistPath?: string
): void {
  ensureDirSync(tmpProjPath());
  newNxProject(npmPackageName, pluginDistPath);
}

function runNxNewCommand(args?: string, silent?: boolean) {
  const localTmpDir = dirname(tmpProjPath());
  return execSync(
    `node ${require.resolve(
      '@nrwl/tao'
    )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty ${
      args || ''
    }`,
    {
      cwd: localTmpDir,
      ...(silent && false ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    }
  );
}
