import { readWorkspaceJson } from '@nrwl/workspace';
import {
  existsSync,
  lstatSync,
  rmdirSync,
  copySync,
  renameSync,
} from 'fs-extra';

export function getPublishableLibNames(workspaceJson = readWorkspaceJson()) {
  const { projects } = workspaceJson;

  return Object.keys(projects).filter(
    (key) =>
      projects[key].projectType === 'library' &&
      projects[key].targets?.build?.executor === '@nrwl/js:tsc'
  );
}

export function tmpProjPath(path?: string) {
  return path
    ? `${process.cwd()}/tmp/nx-playground/proj/${path}`
    : `${process.cwd()}/tmp/nx-playground/proj`;
}

export function copyAndRename(path: string, newPath: string) {
  if (existsSync(newPath)) {
    throw new Error('Already exists');
  }

  if (lstatSync(path).isDirectory()) {
    copySync(path, newPath);
  } else if (lstatSync(path).isFile()) {
    renameSync(path, newPath);
  }
}
