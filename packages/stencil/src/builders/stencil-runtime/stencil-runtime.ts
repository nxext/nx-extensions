import { ConfigFlags, TaskCommand } from '@stencil/core/cli';
import { StencilBuildOptions } from '../build/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { copyFile } from '@nrwl/workspace';
import { map, tap } from 'rxjs/operators';
import { StencilTestOptions } from '../test/schema';
import { fileExists, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { OutputTarget } from '@stencil/core/internal';
import { ensureDirExists } from '../../utils/fileutils';
import { getSystemPath, join, normalize } from '@angular-devkit/core';
import { prepareE2eTesting } from './e2e-testing';
import { ConfigAndCoreCompiler, ConfigAndPathCollection } from './types';
import { initializeStencilConfig } from './stencil-config';

function copyOrCreatePackageJson(values: ConfigAndPathCollection) {
  if (fileExists(values.pkgJson)) {
    copyFile(values.pkgJson, values.distDir);
  } else {
    const libPackageJson = {
      name: values.projectName,
      main: './dist/index.cjs.js',
      module: './dist/index.js',
      es2015: './dist/esm/index.mjs',
      es2017: './dist/esm/index.mjs',
      types: './dist/types/index.d.ts',
      collection: './dist/collection/collection-manifest.json',
      'collection:main': './dist/collection/index.js',
      unpkg: `./dist/${values.projectName}/${values.projectName}.js`,
      files: ['dist/', 'loader/']
    };

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
          [pathVar]: origPath.replace(values.projectRoot, values.distDir)
        });
      }
    });

    return outputTarget;
  });
}

function prepareDistDirAndPkgJson() {
  return function(
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
        'componentDts'
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
        )
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
        coreCompiler: values.coreCompiler
      };
    })
  );
}
