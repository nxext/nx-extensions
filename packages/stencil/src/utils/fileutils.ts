import * as path from 'path';

export function getRelativePath(from: string, to: string) {
  return path.relative(from, to);
}

export function getDistDir(rootDir: string): string {
  return `dist/${rootDir}`;
}
