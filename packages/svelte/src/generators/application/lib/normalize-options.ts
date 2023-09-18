import { getWorkspaceLayout, joinPathFragments, names, Tree } from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';

export async function normalizeOptions(
  host: Tree,
  options: Schema,
  callingGenerator = '@nxext/solid:application'
): Promise<NormalizedSchema> {
  const {
    projectName: appProjectName,
    projectRoot,
    projectNameAndRootFormat,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'application',
    directory: options.directory,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    rootProject: options.rootProject,
    callingGenerator,
  });
  options.rootProject = projectRoot === '.';
  options.projectNameAndRootFormat = projectNameAndRootFormat;

  const e2eProjectName = options.rootProject ? 'e2e' : `${appProjectName}-e2e`;
  const e2eProjectRoot = options.rootProject ? 'e2e' : `${projectRoot}-e2e`;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const fileName = 'App';

  return {
    ...options,
    name: names(options.name).fileName,
    projectName: appProjectName,
    projectRoot,
    e2eProjectName,
    e2eProjectRoot,
    parsedTags,
    fileName,
    skipFormat: false,
  };
}
