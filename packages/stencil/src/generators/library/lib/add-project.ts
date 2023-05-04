import { addProjectConfiguration, Tree } from '@nx/devkit';
import { getTestTarget } from '../../../utils/targets';
import { LibrarySchema } from '../schema';

export function addProject(tree: Tree, options: LibrarySchema) {
  const targets = {
    test: getTestTarget('library', options),
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    generators: {
      '@nxext/stencil:component': {
        style: options.style,
      },
    },
    tags: options.parsedTags,
    targets,
  });
}
