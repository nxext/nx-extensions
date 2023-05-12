import {
  extractLayoutDirectory,
  getWorkspaceLayout,
  names,
  normalizePath,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';
import { getImportPath } from './get-import-path';

export function normalizeOptions<T extends Schema = Schema>(
  host: Tree,
  options: Schema
): NormalizedSchema<T> {
  const name = names(options.name).fileName;
  const { libsDir: defaultLibsDir } = getWorkspaceLayout(host);
  const { projectDirectory, layoutDirectory } = extractLayoutDirectory(
    options.directory
  );
  const fullProjectDirectory = projectDirectory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const e2eProjectName = `${names(options.name).fileName}-e2e`;
  const projectName = fullProjectDirectory.replace(new RegExp('/', 'g'), '-');
  const libsDir = layoutDirectory ?? defaultLibsDir;
  const projectRoot = normalizePath(`${libsDir}/${fullProjectDirectory}`);
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const buildable = options?.buildable || false;
  const importPath =
    options.importPath || getImportPath(host, fullProjectDirectory);

  return {
    ...options,
    projectName,
    e2eProjectName,
    projectRoot,
    parsedTags,
    buildable,
    importPath,
    projectDirectory: fullProjectDirectory,
  } as NormalizedSchema;
}
