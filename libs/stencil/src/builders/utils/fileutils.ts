import { statSync } from 'fs';
import { createDirectory } from '@nrwl/workspace';

function dirExist(dir: string): boolean {
  try {
    return statSync(dir).isDirectory();
  } catch (err) {
    return false;
  }
}

export function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

export function ensureDirExist(dir: string) {
  if (!dirExist(dir)) {
    createDirectory(dir);
  }
}
