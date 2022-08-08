import { readFileSync, writeFileSync } from 'fs-extra';
import { logger } from '@nrwl/devkit';
import * as glob from 'glob';

export function updatePackageJsonFiles(version, isLocal) {
  logger.info('Update versions...');
  let pkgFiles = glob.sync('dist/packages/**/package.json');

  if (isLocal) {
    pkgFiles = pkgFiles.filter((f) => f !== 'package.json');
  }
  pkgFiles.forEach((p) => {
    const content = JSON.parse(readFileSync(p).toString());
    content.version = version;
    for (const key in content.dependencies) {
      if (key.startsWith('@nxext/')) {
        content.dependencies[key] = version;
      }
    }
    writeFileSync(p, JSON.stringify(content, null, 2));
  });
}
