import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { deleteFile, getRelativePath } from './fileutils';
import { fileExists, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { getSystemPath, join, normalize } from '@angular-devkit/core';
import { ConfigAndPathCollection } from './types';

export function prepareE2eTesting() {
  return function (
    source: Observable<ConfigAndPathCollection>
  ): Observable<ConfigAndPathCollection> {
    return source.pipe(
      tap((values: ConfigAndPathCollection) => {
        if (values.config.flags.e2e) {
          const libPackageJson = createDefaultPackageJson(values.projectName, values.projectRoot, values.distDir);

          writeJsonFile(
            getSystemPath(join(values.projectRoot, `package.e2e.json`)),
            libPackageJson
          );
        }
      })
    );
  };
}

function createDefaultPackageJson(projectName: string, projectRoot: string, distDir: string) {
  return {
    name: projectName,
    version: '1',
    main: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/index.js`,
    module: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/index.mjs`,
    es2015: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/esm/index.mjs`,
    es2017: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/esm/index.mjs`,
    types: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/types/index.d.ts`,
    collection: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/collection/collection-manifest.json`,
    'collection:main': `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/collection/index.js`,
    unpkg: `${getRelativePath(
      projectRoot,
      distDir
    )}/dist/${projectName}/${projectName}.js`,
    files: [
      `${getRelativePath(projectRoot, distDir)}/dist/`,
      `${getRelativePath(projectRoot, distDir)}/loader/`,
    ],
  };
}

export function cleanupE2eTesting() {
  return function (
    source: Observable<ConfigAndPathCollection>
  ): Observable<ConfigAndPathCollection> {
    return source.pipe(
      tap((values: ConfigAndPathCollection) => {
        if (values.config.flags.e2e) {
          const pkgJsonPath = getSystemPath(
            join(values.projectRoot, `package.e2e.json`)
          );
          if (fileExists(pkgJsonPath)) {
            deleteFile(pkgJsonPath);
          }
        }
      }),
      map((values: ConfigAndPathCollection) => {
        values.config.packageJsonFilePath = getSystemPath(
          normalize(join(values.projectRoot, `package.e2e.json`))
        );

        return values;
      })
    );
  };
}
