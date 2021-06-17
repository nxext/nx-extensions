import { copyFile, readJsonFile } from '@nrwl/workspace';
import { OutputTarget } from '@stencil/core/internal';
import { prepareE2eTesting } from './e2e-testing';
import { ConfigAndCoreCompiler, ConfigAndPathCollection } from './types';
import {
  createDirectory,
  fileExists,
  writeJsonFile,
} from '@nrwl/workspace/src/utilities/fileutils';
import { joinPathFragments } from '@nrwl/devkit';
import { existsSync } from 'fs';

function copyOrCreatePackageJson(values: ConfigAndPathCollection) {
  const libPackageJson = {
    name: values.projectName,
    version: '0.0.0',
    main: './dist/index.cjs.js',
    module: './dist/index.js',
    es2015: './dist/esm/index.mjs',
    es2017: './dist/esm/index.mjs',
    types: './dist/types/components.d.ts',
    collection: './dist/collection/collection-manifest.json',
    'collection:main': './dist/collection/index.js',
    unpkg: `./dist/${values.projectName}/${values.projectName}.js`,
    files: ['dist/', 'loader/'],
  };

  if (fileExists(values.pkgJson)) {
    copyFile(values.pkgJson, values.distDir);
    const packageJson = readJsonFile(values.pkgJson);
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
    writeJsonFile(values.pkgJson, packageJson);
  } else {
    writeJsonFile(
      joinPathFragments(`${values.distDir}/package.json`),
      libPackageJson
    );
  }
}

function calculateOutputTargetPathVariables(
  values: ConfigAndPathCollection,
  pathVariables: string[]
) {
  return values.config.outputTargets.map((outputTarget) => {
    pathVariables.forEach((pathVar) => {
      if (
        outputTarget[pathVar] != null &&
        !(outputTarget[pathVar] as string).endsWith('src')
      ) {
        const origPath = outputTarget[pathVar];

        outputTarget = Object.assign(outputTarget, {
          [pathVar]: origPath.replace(values.projectRoot, values.distDir),
        });
      }
    });

    return outputTarget;
  });
}

function prepareDistDirAndPkgJson(
  configAndPathCollection: ConfigAndPathCollection
) {
  if (!existsSync(configAndPathCollection.distDir)) {
    createDirectory(configAndPathCollection.distDir);
  }
  copyOrCreatePackageJson(configAndPathCollection);
}

export async function createStencilConfig(
  configAndPathCollection: ConfigAndPathCollection
): Promise<ConfigAndCoreCompiler> {
  prepareDistDirAndPkgJson(configAndPathCollection);
  prepareE2eTesting(configAndPathCollection);

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
    configAndPathCollection,
    pathVariables
  );
  const devServerConfig = Object.assign(
    configAndPathCollection.config.devServer,
    {
      root: configAndPathCollection.config.devServer.root.replace(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      ),
    }
  );

  if (!configAndPathCollection.config.flags.e2e) {
    configAndPathCollection.config.packageJsonFilePath =
      configAndPathCollection.config.packageJsonFilePath.replace(
        configAndPathCollection.projectRoot,
        configAndPathCollection.distDir
      );
  }

  if (configAndPathCollection.config.flags.task === 'build') {
    configAndPathCollection.config.rootDir = configAndPathCollection.distDir;
  }

  const config = Object.assign(
    configAndPathCollection.config,
    { outputTargets: outputTargets },
    { devServer: devServerConfig }
  );

  return {
    config: config,
    coreCompiler: configAndPathCollection.coreCompiler,
  };
}
