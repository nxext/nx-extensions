// Useful in order to cleanup space during CI to prevent `No space left on device` exceptions
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { existsSync, removeSync } from 'fs-extra';
import { join } from 'path';

export function cleanupProject() {
  const tmpDir = tmpProjPath();
  if (existsSync(tmpDir)) {
    removeSync(tmpDir);
  }
}

export function cleanupVerdaccioStorage() {
  const tmpRegistryDir = join(process.cwd(), 'tmp/local-registry');
  if (existsSync(tmpRegistryDir)) {
    removeSync(tmpRegistryDir);
  }
}
