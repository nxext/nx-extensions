import { Tree, updateJson } from '@nx/devkit';
import { addProjectPackageJson } from '@nxext/common';
import { NormalizedSchema } from '../schema';
import { createSvelteCheckTarget } from './targets';

/**
 * Registers the project (project.json in legacy mode, package.json (+
 * nx.targets) in TS-solution mode) - mirrors @nxext/svelte's own
 * application/lib/add-project.ts 1:1, minus the "lint" target (sveltekit's
 * lint target is set up later by `lintProjectGenerator` itself, see
 * add-linting.ts - unlike svelte, sveltekit never hand-rolled its own lint
 * target).
 */
export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets = {
    check: createSvelteCheckTarget(options),
    add: {
      executor: '@nxext/sveltekit:add',
    },
  };

  addProjectPackageJson(tree, {
    projectName: options.projectName,
    projectRoot: options.projectRoot,
    importPath: options.importPath,
    isUsingTsSolutionConfig: options.isUsingTsSolutionConfig,
    useProjectJson: options.useProjectJson,
    projectType: 'application',
    parsedTags: options.parsedTags,
  });

  // Patch in the real check/add targets directly on whichever file backs
  // this project. Deliberately NOT readProjectConfiguration +
  // updateProjectConfiguration: their project-graph discovery for
  // package.json-backed (TS-solution) projects depends on the
  // pnpm-workspace.yaml registration that only happens later
  // (wireTsSolutionProject, called once the runtime tsconfig.app.json
  // exists - see generator.ts) - calling them this early throws "Cannot
  // find configuration for '<name>'".
  if (options.useProjectJson) {
    updateJson(tree, `${options.projectRoot}/project.json`, (json) => {
      json.targets = targets;
      return json;
    });
  } else {
    updateJson(tree, `${options.projectRoot}/package.json`, (json) => {
      json.nx ??= {};
      json.nx.targets = targets;
      // svelte.config.js uses ESM `export default` syntax and MUST be
      // named exactly `svelte.config.js` (SvelteKit's own convention - the
      // filename can't be changed to `.mjs`, unlike svelte's own
      // `.cjs`-named config). Node determines a file's module format from
      // the nearest package.json's `type` field, so this is functionally
      // required for the generated app to load at all, not cosmetic. The
      // static `non-ts-solution/package.json__template__` template already
      // sets this for legacy mode; `addProjectPackageJson`'s shared shape
      // has no `type` field, so it's patched in here for the TS-solution
      // case, where this function is the sole author of package.json.
      json.type = 'module';
      return json;
    });
  }
}
