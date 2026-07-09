import { ApplicationSchema } from '../schema';
import { Tree, updateJson } from '@nx/devkit';
import { addProjectPackageJson } from '@nxext/common';
import { getDefaultTargets } from '../../../utils/targets';
import { addStylePluginToConfig } from '../../../stencil-core-utils';
import { join } from 'path';

export function addProject(host: Tree, options: ApplicationSchema) {
  const targets = getDefaultTargets('application', options);
  const generators = {
    '@nxext/stencil:component': {
      style: options.style,
    },
  };

  // Registers the project (project.json in legacy mode, package.json (+
  // nx.targets/nx.generators) in TS-solution mode) - mirrors
  // @nxext/svelte's own application/lib/add-project.ts 1:1.
  addProjectPackageJson(host, {
    projectName: options.name,
    projectRoot: options.projectRoot,
    importPath: options.importPath,
    isUsingTsSolutionConfig: options.isUsingTsSolutionConfig,
    useProjectJson: options.useProjectJson,
    projectType: 'application',
    parsedTags: options.parsedTags,
  });

  // Patch in the real lint target + component-generator defaults directly
  // on whichever file backs this project. Deliberately NOT
  // readProjectConfiguration + updateProjectConfiguration: their
  // project-graph discovery for package.json-backed (TS-solution) projects
  // depends on the pnpm-workspace.yaml registration that only happens
  // later (wireTsSolutionProject, called once the runtime tsconfig.app.json
  // exists - see generator.ts) - calling them this early throws "Cannot
  // find configuration for '<name>'".
  if (options.useProjectJson) {
    updateJson(host, `${options.projectRoot}/project.json`, (json) => {
      json.targets = targets;
      json.generators = generators;
      return json;
    });
  } else {
    updateJson(host, `${options.projectRoot}/package.json`, (json) => {
      json.nx ??= {};
      json.nx.targets = targets;
      json.nx.generators = generators;
      return json;
    });
  }

  addStylePluginToConfig(
    host,
    join(options.projectRoot, 'stencil.config.ts'),
    options.style,
  );
}
