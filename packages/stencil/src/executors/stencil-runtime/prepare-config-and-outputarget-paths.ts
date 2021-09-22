import { copyFile, readJsonFile } from '@nrwl/workspace';
import { OutputTarget } from '@stencil/core/internal';
import { prepareE2eTesting } from './e2e-testing';
import { PathCollection } from './types';
import {
  createDirectory,
  fileExists,
  writeJsonFile
} from '@nrwl/workspace/src/utilities/fileutils';
import { joinPathFragments } from '@nrwl/devkit';
import { existsSync } from 'fs';
import type { Config } from '@stencil/core/compiler';

function copyOrCreatePackageJson(pathCollection: PathCollection) {
  const libPackageJson = {
    name: pathCollection.projectName,
    version: '0.0.0',
    main: './dist/index.cjs.js',
    module: './dist/index.js',
    es2015: './dist/esm/index.mjs',
    es2017: './dist/esm/index.mjs',
    types: './dist/types/components.d.ts',
    collection: './dist/collection/collection-manifest.json',
    'collection:main': './dist/collection/index.js',
    unpkg: `./dist/${pathCollection.projectName}/${pathCollection.projectName}.js`,
    files: ['dist/', 'loader/']
  };

  if (fileExists(pathCollection.pkgJson)) {
    copyFile(pathCollection.pkgJson, pathCollection.distDir);
    const packageJson = readJsonFile(pathCollection.pkgJson);
    packageJson['main'] ??= libPackageJson.main;
    packageJson['module'] ??= libPackageJson.module;
    packageJson['es2015'] ??= libPackageJson.es2015;
    packageJson['es2017'] ??= libPackageJson.es2017;
    packageJson['types'] ??= libPackageJson.types;
    packageJson['collection'] ??= libPackageJson.collection;
    packageJson['collection:main'] ??= libPackageJson['collection:main'];
    packageJson['unpkg'] ??= libPackageJson.unpkg;
    packageJson['files'] = packageJson.files
      ? [...new Set([...packageJson.files, ...libPackageJson.files])]
      : libPackageJson.files;
    writeJsonFile(pathCollection.pkgJson, packageJson);
  } else {
    writeJsonFile(
      joinPathFragments(pathCollection.distDir, 'package.json'),
      libPackageJson
    );
  }
}

function calculateOutputTargetPathVariables(
  config: Config,
  pathCollection: PathCollection,
  pathVariables: string[]
) {
  return config.outputTargets.map((outputTarget) => {
    pathVariables.forEach((pathVar) => {
      if (
        outputTarget[pathVar] != null &&
        !(outputTarget[pathVar] as string).endsWith('src')
      ) {
        const origPath = outputTarget[pathVar];

        outputTarget = Object.assign(outputTarget, {
          [pathVar]: origPath.replace(pathCollection.projectRoot, pathCollection.distDir)
        });
      }
    });

    return outputTarget;
  });
}

function prepareDistDirAndPkgJson(
  pathCollection: PathCollection
) {
  if (!existsSync(pathCollection.distDir)) {
    createDirectory(pathCollection.distDir);
  }
  copyOrCreatePackageJson(pathCollection);
}

export async function prepareConfigAndOutputargetPaths(
  config: Config,
  pathCollection: PathCollection
): Promise<Config> {
  prepareDistDirAndPkgJson(pathCollection);

  if (config.flags.e2e) {
    prepareE2eTesting(pathCollection);
  }

  const pathVariables = [
    'dir',
    'appDir',
    'buildDir',
    'indexHtml',
    'esmDir',
    'systemDir',
    'systemLoaderFile',
    'file',
    'esmLoaderPath',
    'collectionDir',
    'typesDir',
    'legacyLoaderFile',
    'esmEs5Dir',
    'cjsDir',
    'cjsIndexFile',
    'esmIndexFile',
    'componentDts'
  ];
  const outputTargets: OutputTarget[] = calculateOutputTargetPathVariables(
    config,
    pathCollection,
    pathVariables
  );
  const devServerConfig = Object.assign(
    config.devServer,
    {
      root: config.devServer.root.replace(
        pathCollection.projectRoot,
        pathCollection.distDir
      )
    }
  );

  if (!config.flags.e2e) {
    config.packageJsonFilePath =
      config.packageJsonFilePath.replace(
        pathCollection.projectRoot,
        pathCollection.distDir
      );
  } else {
    config.packageJsonFilePath =
      config.packageJsonFilePath.replace(
        'package.json',
        'package.e2e.json'
      );
  }

  return {
    ...config,
    outputTargets: outputTargets,
    devServer: devServerConfig
  };
}
