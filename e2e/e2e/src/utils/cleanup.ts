// Useful in order to cleanup space during CI to prevent `No space left on device` exceptions
import { existsSync, removeSync } from 'fs-extra';
import { join } from 'path';

export function cleanupVerdaccioStorage() {
  const tmpRegistryDir = join(process.cwd(), 'tmp/local-registry');
  if (existsSync(tmpRegistryDir)) {
    removeSync(tmpRegistryDir);
  }
}
