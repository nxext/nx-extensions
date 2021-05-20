import { ProjectType } from '@nrwl/workspace';
import {
  convertNxGenerator,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { addStylePluginToConfigInTree } from '../../stencil-core-utils/lib/devkit/style-plugins';
import { MakeLibBuildableSchema, NormalizedMakeLibBuildableSchema } from './schema';
import { join } from 'path';
import { addToOutputTargetsInTree } from '../../stencil-core-utils/lib/devkit/plugins';
import { getBuildTarget, getE2eTarget, getServeTarget } from '../../utils/targets';
import { updateTsConfig } from './lib/update-tsconfig';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

function normalize(
  host: Tree,
  options: MakeLibBuildableSchema
): NormalizedMakeLibBuildableSchema {
  const stencilProjectConfig = readProjectConfiguration(host, options.name);

  return { ...options, projectRoot: stencilProjectConfig.root };
}

function createFiles(host: Tree, options: NormalizedMakeLibBuildableSchema) {
  generateFiles(
    host,
    join(__dirname, './files/lib'),
    options.projectRoot,
    {
      ...options,
      offsetFromRoot: offsetFromRoot(options.projectRoot)
    }
  );
}

function addBuildTargets(host: Tree, options: NormalizedMakeLibBuildableSchema) {
  const projectType = ProjectType.Library;
  const stencilProjectConfig = readProjectConfiguration(host, options.name);

  const targets: Record<string, any> = {};
  targets.build = getBuildTarget(projectType, options);
  targets.serve = getServeTarget(projectType, options);
  targets.e2e = getE2eTarget(projectType, options);

  stencilProjectConfig.targets = {
    ...stencilProjectConfig.targets,
    ...targets
  }

  updateProjectConfiguration(host, options.name, stencilProjectConfig);
}

export async function makeLibBuildableGenerator(host: Tree, schema: MakeLibBuildableSchema) {
  const options = normalize(host, schema);

  createFiles(host, options);

  addBuildTargets(host, options);

  addStylePluginToConfigInTree(
    host,
    join(options.projectRoot, 'stencil.config.ts'),
    options.style
  );

  addToOutputTargetsInTree(
    host,
    [
      `{
          type: 'dist',
          esmLoaderPath: '../loader',
          dir: '${offsetFromRoot(options.projectRoot)}dist/${options.projectRoot}/dist',
        }`
    ],
    join(options.projectRoot, 'stencil.config.ts')
  );

  updateTsConfig(host, options);

  return runTasksInSerial(...[]);
}

export default makeLibBuildableGenerator;
export const makeLibBuildableSchematic = convertNxGenerator(makeLibBuildableGenerator);
