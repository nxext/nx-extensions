import { createDirectory } from '@nrwl/workspace';
import { directoryExists } from '@nrwl/workspace/src/utils/fileutils';
import { writeJsonFile, fileExists } from '@nrwl/workspace/src/utils/fileutils';
import { getSystemPath, Path } from '@angular-devkit/core';

export function ensureDirExist(dir: string) {
  if (!directoryExists(dir)) {
    createDirectory(dir);
  }
}

export function writeJsonToFile(path: Path, json: any) {
  writeJsonFile(getSystemPath(path), json);
}

export function fileExist(path: Path) {
  return fileExists(getSystemPath(path));
}
