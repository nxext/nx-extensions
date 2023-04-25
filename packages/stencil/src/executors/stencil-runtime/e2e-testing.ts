import { deleteFile } from '../../utils/fileutils';
import { fileExists } from '@nx/workspace/src/utilities/fileutils';
import { PathCollection } from './types';
import { relative } from 'path';
import { joinPathFragments, writeJsonFile } from '@nx/devkit';

export function prepareE2eTesting(pathCollection: PathCollection) {
  const libPackageJson = {
    name: pathCollection.projectName,
    version: '1',
    main: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/index.cjs.js`,
    module: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/index.js`,
    es2015: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/esm/index.mjs`,
    es2017: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/esm/index.mjs`,
    types: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/types/index.d.ts`,
    collection: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/collection/collection-manifest.json`,
    'collection:main': `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/collection/index.js`,
    unpkg: `${relative(
      pathCollection.projectRoot,
      pathCollection.distDir
    )}/dist/${pathCollection.projectName}/${pathCollection.projectName}.js`,
    files: [
      `${relative(pathCollection.projectRoot, pathCollection.distDir)}/dist/`,
      `${relative(pathCollection.projectRoot, pathCollection.distDir)}/loader/`,
    ],
  };

  writeJsonFile(
    joinPathFragments(`${pathCollection.projectRoot}/package.e2e.json`),
    libPackageJson
  );
}

export function cleanupE2eTesting(pathCollection: PathCollection) {
  const pkgJsonPath = joinPathFragments(
    `${pathCollection.projectRoot}/package.e2e.json`
  );
  if (fileExists(pkgJsonPath)) {
    deleteFile(pkgJsonPath);
  }
}
