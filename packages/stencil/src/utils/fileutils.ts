import * as fs from 'fs';

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
