import {
  extractLayoutDirectory,
  getWorkspaceLayout,
  names,
  normalizePath,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';

export function normalizeDirectory(options: Schema) {
  const { projectDirectory } = extractLayoutDirectory(options.directory);
  return projectDirectory
    ? `${names(projectDirectory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;
}

export function normalizeProjectName(options: Schema) {
  return normalizeDirectory(options).replace(new RegExp('/', 'g'), '-');
}
export function normalizeOptions<T extends Schema = Schema>(
  host: Tree,
  options: Schema
): NormalizedSchema<T> {
  const name = names(options.name).fileName;
  const e2eProjectName = options.rootProject
    ? 'e2e'
    : `${names(options.name).fileName}-e2e`;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const appDirectory = normalizeDirectory(options);
  const appProjectName = normalizeProjectName(options);
  const { layoutDirectory } = extractLayoutDirectory(options.directory);
  const appsDir = layoutDirectory ?? getWorkspaceLayout(host).appsDir;
  const appProjectRoot = options.rootProject
    ? '.'
    : normalizePath(`${appsDir}/${appDirectory}`);
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const routing = options.routing || false;
  const rootProject = false;

  return {
    ...options,
    appProjectName,
    e2eProjectName,
    appProjectRoot,
    rootProject,
    projectDirectory,
    parsedTags,
    routing,
  } as NormalizedSchema;
}
