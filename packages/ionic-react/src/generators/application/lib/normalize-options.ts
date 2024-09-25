import { getWorkspaceLayout, names, normalizePath, Tree } from '@nx/devkit';
import { ApplicationGeneratorSchema, NormalizedSchema } from '../schema';

export function normalizeOptions(
  host: Tree,
  options: ApplicationGeneratorSchema
): NormalizedSchema {
  const appName = options.name;

  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  return {
    ...options,
    appName,
    name: names(options.name).fileName,
    appProjectName,
    appProjectRoot,
    bundler: 'webpack',
  };
}
