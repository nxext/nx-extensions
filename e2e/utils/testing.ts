import {
  cleanup,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
  tmpProjPath,
} from '@nrwl/nx-plugin/testing';
import { readJsonFile, writeJsonFile } from '@nrwl/devkit';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { ensureDirSync, readFileSync, writeFileSync } from 'fs-extra';
import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';
import * as glob from 'glob';

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export function ensureNxProjectAndPrepareDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  optionalDependencyNxextPackages?: [
    npmPackageName: string,
    pluginDistPath: string
  ][],
  optionalAdditionalNxPackages?: Array<string>
): void {
  preparePkgJsonWithDistPaths();
  ensureNxProject(npmPackageName, pluginDistPath);

  optionalDependencyNxextPackages?.forEach(([npmPackageName, pluginDistPath]) =>
    patchPackageJsonForPlugin(npmPackageName, pluginDistPath)
  );

  runPackageManagerInstall();
}

function preparePkgJsonWithDistPaths(): void {
  const distPaths = getDistPaths();
  let pkgFiles = glob.sync('dist/packages/**/package.json');

  pkgFiles.forEach((p) => {
    const content = JSON.parse(readFileSync(p).toString());
    for (const key in content.dependencies) {
      if (key.startsWith('@nxext/')) {
        content.dependencies[key] = distPaths[key];
      }
    }
    writeFileSync(p, JSON.stringify(content, null, 2));
  });
}

function getDistPaths(): Record<string, string> {
  const tsConfigBase = readJsonFile('./tsconfig.base.json');
  return Object.entries(tsConfigBase.compilerOptions.paths).reduce<
    Record<string, string>
  >((acc, cur) => {
    acc[cur[0]] = `file:${workspaceRoot}/dist/${cur[1][0].split('/src')[0]}`;

    return acc;
  }, {} as Record<string, string>);
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
    )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty --packageManager=yarn ${
      args || ''
    }`,
    {
      cwd: localTmpDir,
      ...(silent && false ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
    }
  );
}
