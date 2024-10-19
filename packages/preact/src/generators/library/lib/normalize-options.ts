import { Tree } from '@nx/devkit';
import { NormalizedSchema, PreactLibrarySchema } from '../schema';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';

export async function normalizeOptions(
  tree: Tree,
  options: PreactLibrarySchema
): Promise<NormalizedSchema> {
  await ensureProjectName(tree, options, 'library');
  const {
    projectName,
    names: projectNames,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: 'library',
    directory: options.directory,
    importPath: options.importPath,
    rootProject: false,
  });
  const fileName =
    /* options.simpleName
    ? projectNames.projectSimpleName
    :  */ projectNames.projectFileName;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    parsedTags,
    fileName,
    projectDirectory: projectRoot,
    importPath,
  };
}
