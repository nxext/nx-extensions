import { addProjectConfiguration, Tree } from '@nx/devkit';
import { LibrarySchema } from '../schema';

export function addProject(tree: Tree, options: LibrarySchema) {
  // `test` (and `build`/`serve`/`e2e` for buildable libs) is inferred by
  // `@nxext/stencil/plugin` from the presence of `stencil.config.ts`. Plain
  // libraries without a stencil config get no runtime targets here — just
  // project metadata.
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
    targets: {},
  });
}
