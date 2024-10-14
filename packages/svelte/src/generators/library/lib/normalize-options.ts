import { names, Tree } from '@nx/devkit';
import { NormalizedSchema, SvelteLibrarySchema } from '../schema';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';

export async function normalizeOptions(
  host: Tree,
  options: SvelteLibrarySchema
): Promise<NormalizedSchema> {
  await ensureProjectName(host, options, 'library');
  const {
    projectName,
    names: projectNames,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'library',
    directory: options.directory,
    importPath: options.importPath,
  });
  // const name = names(options.name).fileName;
  // const projectDirectory = options.directory
  //   ? `${names(options.directory).fileName}/${name}`
  //   : name;
  const fileName = options.simpleName
    ? projectNames.projectSimpleName
    : projectNames.projectFileName;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    name: projectName,
    projectRoot,
    parsedTags,
    fileName,
    projectDirectory: projectRoot,
    importPath,
  };
}
