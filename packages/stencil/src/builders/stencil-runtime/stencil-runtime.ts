import { ConfigFlags, TaskCommand } from '@stencil/core/cli';
import { StencilBuildOptions } from '../build/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { copyFile, readJsonFile } from '@nrwl/workspace';
import { map, tap } from 'rxjs/operators';
import { StencilTestOptions } from '../test/schema';
import { OutputTarget } from '@stencil/core/internal';
import { ensureDirExists } from '../../utils/fileutils';
import { getSystemPath, join, normalize } from '@angular-devkit/core';
import { prepareE2eTesting } from './e2e-testing';
import { ConfigAndCoreCompiler, ConfigAndPathCollection } from './types';
import { initializeStencilConfig } from './stencil-config';
import {
  writeJsonFile,
  fileExists,
} from '@nrwl/workspace/src/utilities/fileutils';

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
    packageJson['main'] = libPackageJson.main;
    packageJson['module'] = libPackageJson.module;
    packageJson['es2015'] = libPackageJson.es2015;
    packageJson['es2017'] = libPackageJson.es2017;
    packageJson['types'] = libPackageJson.types;
    packageJson['collection'] = libPackageJson.collection;
    packageJson['collection:main'] = libPackageJson['collection:main'];
    packageJson['unpkg'] = libPackageJson.unpkg;
    packageJson['files'] = libPackageJson.files;
    writeJsonFile(values.pkgJson, packageJson);
  } else {
    writeJsonFile(
      getSystemPath(join(values.distDir, `package.json`)),
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
        const origPath = getSystemPath(
          normalize(outputTarget[pathVar] as string)
        );
        outputTarget = Object.assign(outputTarget, {
          [pathVar]: origPath.replace(values.projectRoot, values.distDir),
        });
      }
    });

    return outputTarget;
  });
}

function prepareDistDirAndPkgJson() {
  return function (
    source: Observable<ConfigAndPathCollection>
  ): Observable<ConfigAndPathCollection> {
    return source.pipe(
      tap((values: ConfigAndPathCollection) => {
        ensureDirExists(values.distDir);
        copyOrCreatePackageJson(values);
      })
    );
  };
}

export function createStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuildOptions | StencilTestOptions,
  context: BuilderContext,
  createStencilCompilerOptions: (
    taskCommand: TaskCommand,
    options: StencilBuildOptions
  ) => ConfigFlags
): Observable<ConfigAndCoreCompiler> {
  return from(
    initializeStencilConfig(
      taskCommand,
      options,
      context,
      createStencilCompilerOptions
    )
  ).pipe(
    prepareDistDirAndPkgJson(),
    prepareE2eTesting(),
    map((values: ConfigAndPathCollection) => {
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
        values,
        pathVariables
      );
      const devServerConfig = Object.assign(values.config.devServer, {
        root: getSystemPath(
          normalize(
            normalize(values.config.devServer.root).replace(
              normalize(values.projectRoot),
              values.distDir
            )
          )
        ),
      });

      if (!values.config.flags.e2e) {
        values.config.packageJsonFilePath = getSystemPath(
          normalize(
            normalize(values.config.packageJsonFilePath).replace(
              values.projectRoot,
              values.distDir
            )
          )
        );
      }

      if (values.config.flags.task === 'build') {
        values.config.rootDir = getSystemPath(values.distDir);
      }

      const config = Object.assign(
        values.config,
        { outputTargets: outputTargets },
        { devServer: devServerConfig }
      );

      return {
        config: config,
        coreCompiler: values.coreCompiler,
      };
    })
  );
}
