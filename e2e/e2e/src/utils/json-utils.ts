import { readFileSync, writeFileSync } from 'fs-extra';
import { joinPathFragments, logger } from '@nrwl/devkit';
import * as glob from 'glob';

export function updatePackageJsonFiles(
  version: string,
  distDir: string,
  npmScope: string
) {
  logger.info('Update versions...');
  let pkgFiles = glob.sync(joinPathFragments(distDir, '/**/package.json'));

  pkgFiles = pkgFiles.filter((f) => f !== 'package.json');
  pkgFiles.forEach((p) => {
    const content = JSON.parse(readFileSync(p).toString());
    content.version = version;
    for (const key in content.dependencies) {
      if (key.startsWith(`@${npmScope}/`)) {
        content.dependencies[key] = version;
      }
    }
    writeFileSync(p, JSON.stringify(content, null, 2));
  });
}
