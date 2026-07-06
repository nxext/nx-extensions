import { Tree, updateJson } from '@nx/devkit';
import { addProjectPackageJson } from '@nxext/common';
import { LibrarySchema } from '../schema';

export function addProject(tree: Tree, options: LibrarySchema) {
  // `test` (and `build`/`serve`/`e2e` for buildable libs) is inferred by
  // `@nxext/stencil/plugin` from the presence of `stencil.config.ts`. Plain
  // libraries without a stencil config get no runtime targets here — just
  // project metadata + the component-generator defaults.
  const generators = {
    '@nxext/stencil:component': {
      style: options.style,
    },
  };

  const isBuildableOrPublishable = !!(options.buildable || options.publishable);

  // Registers the project (project.json in legacy mode, package.json (+
  // nx.generators) in TS-solution mode) - mirrors @nxext/svelte's own
  // library/lib/add-project.ts.
  addProjectPackageJson(tree, {
    projectName: options.name,
    projectRoot: options.projectRoot,
    importPath: options.importPath,
    isUsingTsSolutionConfig: options.isUsingTsSolutionConfig,
    useProjectJson: options.useProjectJson,
    projectType: 'library',
    parsedTags: options.parsedTags,
    // Buildable/publishable libs get their real package.json entry point
    // written later by `make-lib-buildable` (which overwrites this
    // package.json wholesale with Stencil's dist-output shape). Plain
    // libraries never go through that generator though, and in TS-solution
    // mode every project still needs a resolvable entry point for other
    // workspace projects that consume it via the package-manager symlink
    // (no separate build step) - mirrors @nx/js's `bundler: 'none'` handling.
    ...(options.isUsingTsSolutionConfig && !isBuildableOrPublishable
      ? {
          main: './src/index.ts',
          exports: {
            '.': {
              types: './src/index.ts',
              import: './src/index.ts',
              default: './src/index.ts',
            },
            './package.json': './package.json',
          },
        }
      : {}),
  });

  // Patch in the component-generator defaults directly on whichever file
  // backs this project. Deliberately NOT readProjectConfiguration +
  // updateProjectConfiguration - see application/lib/add-project.ts for why.
  if (options.useProjectJson) {
    updateJson(tree, `${options.projectRoot}/project.json`, (json) => {
      json.generators = generators;
      return json;
    });
  } else {
    updateJson(tree, `${options.projectRoot}/package.json`, (json) => {
      json.nx ??= {};
      json.nx.generators = generators;
      return json;
    });
  }
}
