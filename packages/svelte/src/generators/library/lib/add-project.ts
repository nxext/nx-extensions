import { NormalizedSchema } from '../schema';
import { Tree, updateJson } from '@nx/devkit';
import { addProjectPackageJson } from '@nxext/common';
import { createLintAndCheckTargets } from '../../utils/targets';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets = createLintAndCheckTargets(options);

  const isBuildableOrPublishable = !!(options.buildable || options.publishable);

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
    // (`addVite`, application.ts's Vite wiring is out of scope to touch -
    // it already branches on TS-solution internally). Non-buildable,
    // non-publishable libs never go through that generator though, and in
    // TS-solution mode every project still needs a resolvable entry point
    // for other workspace projects that consume it via the package-manager
    // symlink (no separate build step) - mirrors @nx/js's
    // `determineEntryFields` for `bundler: 'none'`.
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

  // Patch in the real lint/check targets directly on whichever file backs
  // this project. Deliberately NOT `readProjectConfiguration` +
  // `updateProjectConfiguration`: their project-graph discovery for
  // package.json-backed (TS-solution) projects depends on the
  // pnpm-workspace.yaml registration that only happens later
  // (`wireTsSolutionProject`, called once the runtime tsconfig.lib.json
  // exists - see library.ts) - calling them this early throws "Cannot find
  // configuration for '<name>'".
  if (options.useProjectJson) {
    updateJson(tree, `${options.projectRoot}/project.json`, (json) => {
      json.targets = targets;
      return json;
    });
  } else {
    updateJson(tree, `${options.projectRoot}/package.json`, (json) => {
      json.nx ??= {};
      json.nx.targets = targets;
      return json;
    });
  }
}
