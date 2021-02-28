import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { deleteFile, getRelativePath } from '../../utils/fileutils';
import {
  writeJsonFile,
  fileExists,
} from '@nrwl/workspace/src/utilities/fileutils';
import { getSystemPath, join, normalize } from '@angular-devkit/core';
import { ConfigAndPathCollection } from './types';

export function prepareE2eTesting() {
  return function (
    source: Observable<ConfigAndPathCollection>
  ): Observable<ConfigAndPathCollection> {
    return source.pipe(
      tap((values: ConfigAndPathCollection) => {
        if (values.config.flags.e2e) {
          const libPackageJson = {
            name: values.projectName,
            version: '1',
            main: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/index.js`,
            module: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/index.mjs`,
            es2015: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/esm/index.mjs`,
            es2017: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/esm/index.mjs`,
            types: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/types/index.d.ts`,
            collection: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/collection/collection-manifest.json`,
            'collection:main': `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/collection/index.js`,
            unpkg: `${getRelativePath(
              values.projectRoot,
              values.distDir
            )}/dist/${values.projectName}/${values.projectName}.js`,
            files: [
              `${getRelativePath(values.projectRoot, values.distDir)}/dist/`,
              `${getRelativePath(values.projectRoot, values.distDir)}/loader/`,
            ],
          };

          writeJsonFile(
            getSystemPath(join(values.projectRoot, `package.e2e.json`)),
            libPackageJson
          );
        }
      })
    );
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
