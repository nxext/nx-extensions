import { readWorkspaceJson } from '@nrwl/workspace';

export function getPublishableLibNames(workspaceJson = readWorkspaceJson()) {
  const { projects } = workspaceJson;

  return Object.keys(projects).filter(
    (key) =>
      projects[key].projectType === 'library' &&
      projects[key].targets?.build?.executor === '@nrwl/node:package'
  );
}

export function tmpProjPath(path?: string) {
  return path
    ? `${process.cwd()}/tmp/nx-playground/proj/${path}`
    : `${process.cwd()}/tmp/nx-playground/proj`;
}
