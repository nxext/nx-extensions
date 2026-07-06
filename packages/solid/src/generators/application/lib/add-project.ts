import { NormalizedSchema } from '../schema';
import { Tree, updateJson } from '@nx/devkit';
import { addProjectPackageJson, createEslintLintTarget } from '@nxext/common';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets = {
    lint: createEslintLintTarget(options.appProjectRoot, 'tsconfig.app.json'),
  };

  // Registers the project (project.json in legacy mode, package.json
  // (+ nx.name/nx.tags) in TS-solution mode) - `addProjectPackageJson`
  // (`@nxext/common`) always writes with `targets: {}` (project.json case)
  // or no `targets` at all (package.json+nx case).
  addProjectPackageJson(tree, {
    projectName: options.name,
    projectRoot: options.appProjectRoot,
    importPath: options.importPath,
    isUsingTsSolutionConfig: options.isUsingTsSolutionConfig,
    useProjectJson: options.useProjectJson,
    projectType: 'application',
    parsedTags: options.parsedTags,
  });

  // Patch in the real lint target directly on whichever file backs this
  // project. Deliberately NOT `readProjectConfiguration` +
  // `updateProjectConfiguration`: their project-graph discovery for
  // package.json-backed (TS-solution) projects depends on the
  // pnpm-workspace.yaml registration that only happens later
  // (`wireTsSolutionProject`, called once the runtime tsconfig.app.json
  // exists - see application.ts) - calling them this early throws "Cannot
  // find configuration for '<name>'".
  if (options.useProjectJson) {
    updateJson(tree, `${options.appProjectRoot}/project.json`, (json) => {
      json.targets = targets;
      return json;
    });
  } else {
    updateJson(tree, `${options.appProjectRoot}/package.json`, (json) => {
      json.nx ??= {};
      json.nx.targets = targets;
      return json;
    });
  }
}
