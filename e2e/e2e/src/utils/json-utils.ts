import { readFileSync, writeFileSync } from 'fs-extra';
import { joinPathFragments, logger, readNxJson } from '@nrwl/devkit';
import * as glob from 'glob';

export function updatePackageJsonFiles(version: string, distDir: string) {
  logger.info('Update versions...');
  const nxJson = readNxJson();
  let pkgFiles = glob.sync(joinPathFragments(distDir, '**/package.json'));
  pkgFiles = pkgFiles.filter((f) => f !== 'package.json');

  pkgFiles.forEach((pkg: string) => {
    const content = JSON.parse(readFileSync(pkg).toString());
    content.version = version;
    for (const key in content.dependencies) {
      if (key.startsWith(`@${nxJson.npmScope}/`)) {
        content.dependencies[key] = version;
      }
    }
    writeFileSync(pkg, JSON.stringify(content, null, 2));
  });
}
