import { createDirectory } from '@nrwl/workspace';
import { directoryExists } from '@nrwl/workspace/src/utils/fileutils';

export function ensureDirExist(dir: string) {
  if (!directoryExists(dir)) {
    createDirectory(dir);
  }
}
