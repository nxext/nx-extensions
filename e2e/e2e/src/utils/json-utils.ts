import { readFileSync, writeFileSync } from 'fs-extra';
import { joinPathFragments, logger, readNxJson } from '@nrwl/devkit';
import * as glob from 'glob';

export function updatePackageJsonFiles(version, disDir: string) {
  logger.info('Update versions...');
  const nxJson = readNxJson();
  let pkgFiles = glob.sync(joinPathFragments(disDir, '/**/package.json'));

  pkgFiles = pkgFiles.filter((f) => f !== 'package.json');
  pkgFiles.forEach((p) => {
    const content = JSON.parse(readFileSync(p).toString());
    content.version = version;
    for (const key in content.dependencies) {
      if (key.startsWith(`@${nxJson.npmScope}/`)) {
        content.dependencies[key] = version;
      }
    }
    writeFileSync(p, JSON.stringify(content, null, 2));
  });
}
