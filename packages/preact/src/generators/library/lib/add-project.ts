import { NormalizedSchema } from '../schema';
import { Tree } from '@nx/devkit';
import { addProjectPackageJson } from '@nxext/common';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const isBuildableOrPublishable = !!(options.buildable || options.publishable);

  // Registers the project (project.json in legacy mode, package.json
  // (+ nx.name/nx.tags) in TS-solution mode) - mirrors svelte's
  // `library/lib/add-project.ts`. Unlike svelte/application, preact's
  // library has never had a `targets` object here (pre-existing gap,
  // deliberately preserved in legacy mode - see report) - there is no
  // analogous `nx.targets` patch to carry over into TS-solution mode
  // either, so none is added.
  addProjectPackageJson(tree, {
    projectName: options.name,
    projectRoot: options.projectRoot,
    importPath: options.importPath,
    isUsingTsSolutionConfig: options.isUsingTsSolutionConfig,
    useProjectJson: options.useProjectJson,
    projectType: 'library',
    parsedTags: options.parsedTags,
    // Buildable/publishable libs get their package.json entry point wired
    // up later by `@nx/vite`'s own configuration generator once it's added
    // (`addVite`, which already branches on TS-solution internally). Non-
    // buildable, non-publishable libs never go through that generator
    // though, and in TS-solution mode every project still needs a
    // resolvable entry point for other workspace projects that consume it
    // via the package-manager symlink (no separate build step) - mirrors
    // `@nx/js`'s `determineEntryFields` for `bundler: 'none'`.
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
}
