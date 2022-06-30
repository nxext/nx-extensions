import { NormalizedSchema, Schema } from '../schema';
import { names, Tree, normalizePath, getWorkspaceLayout } from '@nxext/devkit';

export function normalizeOptions(
  host: Tree,
  options: Schema
): NormalizedSchema {
  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const fileName = options.pascalCaseFiles ? 'App' : 'app';

  options.supportJSX = options.supportJSX ?? true;
  options.unitTestRunner = options.unitTestRunner ?? 'jest';

  return {
    ...options,
    name: names(options.name).fileName,
    projectName: appProjectName,
    projectRoot: appProjectRoot,
    parsedTags,
    fileName,
  };
}
