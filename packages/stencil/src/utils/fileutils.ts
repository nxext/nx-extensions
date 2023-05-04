import * as path from 'path';
import * as fs from 'fs';

export function getRelativePath(from: string, to: string) {
  return path.relative(from, to);
}

export function getDistDir(rootDir: string): string {
  return `dist/${rootDir}`;
}

export function deleteFile(path: string) {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    // empty
  }
}
