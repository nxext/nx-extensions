// Updating the version in "package.json" before publishing
import { join } from 'path';
import * as glob from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { NX_VERSION } from '@nx/devkit';

try {
  const pkgDir = join(process.cwd(), 'packages');
  const pkgFiles = glob.sync(join(pkgDir, '/**/package.json'));
  const version = `^${NX_VERSION}`;

  pkgFiles.forEach((p) => {
    const content = JSON.parse(readFileSync(p).toString());
    for (const key in content.dependencies) {
      if (key.startsWith(`@nx/`) || key == 'nx') {
        content.dependencies[key] = version;
      }
    }
    for (const key in content.peerDependencies) {
      if (key.startsWith(`@nx/`) || key == 'nx') {
        content.peerDependencies[key] = version;
      }
    }
    writeFileSync(p, JSON.stringify(content, null, 2));
  });
} catch (e) {
  console.error(`Error reading package.json file from library build output.`);
}
