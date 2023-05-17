import { existsSync, lstatSync, copySync, renameSync } from 'fs-extra';
import { workspaceRoot } from '@nx/devkit';
import { Workspaces } from 'nx/src/config/workspaces';

export function getPublishableLibNames(
  workspaceJson = new Workspaces(workspaceRoot).readWorkspaceConfiguration()
) {
  const { projects } = workspaceJson;

  return Object.keys(projects).filter(
    (key) =>
      projects[key].projectType === 'library' &&
      projects[key].targets?.build?.executor === '@nx/js:tsc' &&
      projects[key].sourceRoot !== 'e2e/e2e/src'
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
