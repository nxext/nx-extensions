import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  readNxJson,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';
import {
  determineProjectNameAndRootOptions,
  ensureRootProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';

export async function normalizeOptions(
  host: Tree,
  options: Schema
): Promise<NormalizedSchema> {
  await ensureRootProjectName(options, 'application');
  const { projectName, projectRoot } = await determineProjectNameAndRootOptions(
    host,
    {
      name: options.name,
      projectType: 'application',
      directory: options.directory,
      rootProject: options.rootProject,
    }
  );
  options.name ??= projectName;
  options.rootProject = projectRoot === '.';

  const nxJson = readNxJson(host);

  let e2eWebServerTarget = 'serve';
  let e2ePort = 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    nxJson.targetDefaults?.[e2eWebServerTarget].options?.port
  ) {
    e2ePort = nxJson.targetDefaults?.[e2eWebServerTarget].options?.port;
  }

  const e2eProjectName = options.rootProject ? 'e2e' : `${projectName}-e2e`;
  const e2eProjectRoot = options.rootProject ? 'e2e' : `${projectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const fileName = 'App';

  return {
    ...options,
    name: names(options.name).fileName,
    projectName,
    projectRoot,
    e2eProjectName,
    e2eProjectRoot,
    parsedTags,
    fileName,
    e2eWebServerAddress,
    e2eWebServerTarget,
    skipFormat: false,
  };
}
