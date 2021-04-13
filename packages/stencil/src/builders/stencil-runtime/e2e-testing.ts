import { deleteFile } from '../../utils/fileutils';
import { fileExists, writeJsonFile } from '@nrwl/workspace/src/utilities/fileutils';
import { ConfigAndPathCollection } from './types';
import { relative } from 'path';
import { joinPathFragments } from '@nrwl/devkit';

export function prepareE2eTesting(configAndPathCollection: ConfigAndPathCollection) {
  if (configAndPathCollection.config.flags.e2e) {
    const libPackageJson = {
      name: configAndPathCollection.projectName,
      version: '1',
      main: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/index.js`,
      module: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/index.mjs`,
      es2015: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/esm/index.mjs`,
      es2017: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/esm/index.mjs`,
      types: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/types/index.d.ts`,
      collection: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/collection/collection-manifest.json`,
      'collection:main': `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/collection/index.js`,
      unpkg: `${relative(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      )}/dist/${configAndPathCollection.projectName}/${configAndPathCollection.projectName}.js`,
      files: [
        `${relative(configAndPathCollection.projectRoot, configAndPathCollection.distDir)}/dist/`,
        `${relative(configAndPathCollection.projectRoot, configAndPathCollection.distDir)}/loader/`
      ]
    };

    writeJsonFile(
      joinPathFragments(`${configAndPathCollection.projectRoot}/package.e2e.json`),
      libPackageJson
    );
  }
}

export function cleanupE2eTesting(configAndPathCollection: ConfigAndPathCollection) {
  if (configAndPathCollection.config.flags.e2e) {
    const pkgJsonPath = joinPathFragments(`${configAndPathCollection.projectRoot}/package.e2e.json`);
    if (fileExists(pkgJsonPath)) {
      deleteFile(pkgJsonPath);
    }
  }

  configAndPathCollection.config.packageJsonFilePath = joinPathFragments(`${configAndPathCollection.projectRoot}/package.json`)

  return configAndPathCollection;
}
