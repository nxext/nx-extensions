import { PathCollection } from './types';
import {
  createDirectory,
  fileExists,
  copyFile,
} from '@nx/workspace/src/utilities/fileutils';
import { joinPathFragments, writeJsonFile } from '@nx/devkit';
import { existsSync } from 'fs';
import type { Config } from '@stencil/core/compiler';
import { prepareE2eTesting } from './e2e-testing';

function copyOrCreatePackageJson(pathCollection: PathCollection) {
  const libPackageJson = {
    name: pathCollection.projectName,
    version: '0.0.0',
    main: './dist/index.cjs.js',
    module: './dist/index.js',
    es2015: './dist/esm/index.mjs',
    es2017: './dist/esm/index.mjs',
    types: './dist/types/index.d.ts',
    collection: './dist/collection/collection-manifest.json',
    'collection:main': './dist/collection/index.js',
    unpkg: `./dist/${pathCollection.projectName}/${pathCollection.projectName}.js`,
    files: ['dist/', 'loader/'],
  };

  if (fileExists(pathCollection.pkgJson)) {
    if (pathCollection.projectRoot !== pathCollection.distDir) {
      copyFile(pathCollection.pkgJson, pathCollection.distDir);
    }
  } else {
    writeJsonFile(
      joinPathFragments(pathCollection.distDir, 'package.json'),
      libPackageJson
    );
  }
}

function prepareDistDirAndPkgJson(pathCollection: PathCollection) {
  if (!existsSync(pathCollection.distDir)) {
    createDirectory(pathCollection.distDir);
  }
  copyOrCreatePackageJson(pathCollection);
}

/**
 * Bootstraps the stencil config for an executor run: ensures the dist
 * directory exists, scaffolds the publishable package.json inside it,
 * and (for e2e) stages a `package.e2e.json` at the project root.
 *
 * Output-target paths themselves are not rewritten. `initializeStencilConfig`
 * already overrides `config.rootDir` to the distDir, which redirects every
 * default output target — user-defined `dir`s are respected as-is.
 */
export async function prepareConfigAndOutputargetPaths(
  config: Config,
  pathCollection: PathCollection
): Promise<Config> {
  prepareDistDirAndPkgJson(pathCollection);

  if (config.flags.e2e) {
    prepareE2eTesting(pathCollection);
    config.packageJsonFilePath = config.packageJsonFilePath.replace(
      'package.json',
      'package.e2e.json'
    );
  } else {
    config.packageJsonFilePath = config.packageJsonFilePath.replace(
      pathCollection.projectRoot,
      pathCollection.distDir
    );
  }

  return config;
}
