import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { deleteFile, getRelativePath } from '../../utils/fileutils';
import { fileExists, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { getSystemPath, join, normalize } from '@angular-devkit/core';
import { ConfigAndPathCollection } from './stencil-runtime';

export function prepareE2eTesting() {
  return function(
    source: Observable<ConfigAndPathCollection>
  ): Observable<ConfigAndPathCollection> {
    return source.pipe(tap((values: ConfigAndPathCollection) => {
      if (values.config.flags.e2e) {
        const libPackageJson = {
          name: values.projectName,
          version: '1',
          main: `${getRelativePath(values.projectRoot, values.distDir)}/dist/index.js`,
          module: `${getRelativePath(values.projectRoot, values.distDir)}/dist/index.mjs`,
          es2015: `${getRelativePath(values.projectRoot, values.distDir)}/dist/esm/index.mjs`,
          es2017: `${getRelativePath(values.projectRoot, values.distDir)}/dist/esm/index.mjs`,
          types: `${getRelativePath(values.projectRoot, values.distDir)}/dist/types/index.d.ts`,
          collection: `${getRelativePath(values.projectRoot, values.distDir)}/dist/collection/collection-manifest.json`,
          'collection:main': `${getRelativePath(values.projectRoot, values.distDir)}/dist/collection/index.js`,
          unpkg: `${getRelativePath(values.projectRoot, values.distDir)}/dist/${values.projectName}/${values.projectName}.js`,
          files: [`${getRelativePath(values.projectRoot, values.distDir)}/dist/`, `${getRelativePath(values.projectRoot, values.distDir)}/loader/`]
        };

        writeJsonFile(
          getSystemPath(join(values.projectRoot, `package.e2e.json`)),
          libPackageJson
        );
      }
    }));
  };
}

export function cleanupE2eTesting() {
  return function(
    source: Observable<ConfigAndPathCollection>
  ): Observable<ConfigAndPathCollection> {
    return source.pipe(
      tap((values: ConfigAndPathCollection) => {
        if (values.config.flags.e2e) {
          const pkgJsonPath = getSystemPath(join(values.projectRoot, `package.e2e.json`));
          if (fileExists(pkgJsonPath)) {
            deleteFile(pkgJsonPath);
          }
        }
      }),
      map((values: ConfigAndPathCollection) => {
        values.config.packageJsonFilePath = getSystemPath(normalize(join(values.projectRoot, `package.e2e.json`)));

        return values;
      })
    );
  };
}
