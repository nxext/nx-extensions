import { Tree } from '@nx/devkit';
import { normalizeViteLibCore } from '@nxext/common';
import { NormalizedSchema, PreactLibrarySchema } from '../schema';

export async function normalizeOptions(
  tree: Tree,
  options: PreactLibrarySchema,
): Promise<NormalizedSchema> {
  const core = await normalizeViteLibCore(tree, {
    name: options.name,
    directory: options.directory,
    tags: options.tags,
    importPath: options.importPath,
  });

  // fileName stays a local computation (kept in sync with the
  // `projectFileName` logic from `determineProjectNameAndRootOptions`),
  // since `normalizeViteLibCore` intentionally doesn't expose it.
  const fileName = core.projectName.startsWith('@')
    ? core.projectName.split('/').slice(1).join('-')
    : core.projectName;

  return {
    ...options,
    name: options.name ?? core.projectName,
    projectName: core.projectName,
    projectRoot: core.projectRoot,
    parsedTags: core.parsedTags,
    fileName,
    projectDirectory: core.projectRoot,
    importPath: core.importPath,
    isUsingTsSolutionConfig: core.isUsingTsSolutionConfig,
    // Nx pattern (react/vue `normalize-options.js`): default is the exact
    // negation of the TS-solution flag. Not exposed as a user-facing CLI
    // option here - see report for the scope rationale.
    useProjectJson: !core.isUsingTsSolutionConfig,
  };
}
