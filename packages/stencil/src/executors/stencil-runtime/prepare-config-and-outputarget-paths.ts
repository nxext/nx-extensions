import { OutputTarget } from '@stencil/core/internal';
import { prepareE2eTesting } from './e2e-testing';
import { PathCollection } from './types';
import {
  createDirectory,
  fileExists,
  copyFile,
} from '@nx/workspace/src/utilities/fileutils';
import { joinPathFragments, writeJsonFile } from '@nx/devkit';
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
    types: './dist/types/index.d.ts',
    collection: './dist/collection/collection-manifest.json',
    'collection:main': './dist/collection/index.js',
    unpkg: `./dist/${pathCollection.projectName}/${pathCollection.projectName}.js`,
    files: ['dist/', 'loader/'],
  };

  if (fileExists(pathCollection.pkgJson)) {
    copyFile(pathCollection.pkgJson, pathCollection.distDir);
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
  return config.outputTargets.map((outputTarget: OutputTarget) => {
    // don't change the angular, react, vue or svelte output targets
    if (outputTarget.type === 'custom') {
      return outputTarget;
    }

    pathVariables.forEach((pathVar) => {
      if (
        outputTarget[pathVar] != null &&
        !(outputTarget[pathVar] as string).endsWith('src')
      ) {
        const origPath = outputTarget[pathVar];

        outputTarget = Object.assign(outputTarget, {
          [pathVar]: origPath.replace(
            pathCollection.projectRoot,
            pathCollection.distDir
          ),
        });
      }
    });

    return outputTarget;
  });
}

function prepareDistDirAndPkgJson(pathCollection: PathCollection) {
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
    'componentDts',
  ];
  const outputTargets: OutputTarget[] = calculateOutputTargetPathVariables(
    config,
    pathCollection,
    pathVariables
  );
  const devServerConfig = Object.assign(config.devServer, {
    root: config.devServer.root.replace(
      pathCollection.projectRoot,
      pathCollection.distDir
    ),
    openBrowser: config.flags.open,
  });

  if (!config.flags.e2e) {
    config.packageJsonFilePath = config.packageJsonFilePath.replace(
      pathCollection.projectRoot,
      pathCollection.distDir
    );
  } else {
    config.packageJsonFilePath = config.packageJsonFilePath.replace(
      'package.json',
      'package.e2e.json'
    );
  }

  return {
    ...config,
    outputTargets: outputTargets,
    devServer: devServerConfig,
  };
}
