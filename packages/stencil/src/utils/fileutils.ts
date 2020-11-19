import * as path from 'path';
import * as fs from 'fs';
import { createDirectory } from '@nrwl/workspace';
import { directoryExists as nxDirectoryExists, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { getSystemPath, Path } from '@angular-devkit/core';

export function getRelativePath(from: string, to: string) {
  return path.relative(from, to);
}

export function getDistDir(rootDir: string): string {
  return `dist/${rootDir}`;
}

export function ensureDirExists(dir: string) {
  if (!nxDirectoryExists(dir)) {
    createDirectory(dir);
  }
}

export function writeJsonToFile(path: Path, json: any) {
  writeJsonFile(getSystemPath(path), json);
}

export function deleteFile(path: string) {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    // empty
  }
}
