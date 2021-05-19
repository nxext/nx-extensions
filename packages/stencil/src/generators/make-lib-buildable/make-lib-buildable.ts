import { ProjectType } from '@nrwl/workspace';
import {
  convertNxGenerator,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  formatFiles,
  updateProjectConfiguration
} from '@nrwl/devkit';
import { addStylePluginToConfigInTree } from '../../stencil-core-utils/lib/devkit/style-plugins';
import { MakeLibBuildableSchema } from './schema';
import { join } from 'path';
import { addToOutputTargetsInTree } from '../../stencil-core-utils/lib/devkit/plugins';
import { getBuildTarget, getE2eTarget, getServeTarget } from '../../utils/targets';
import { updateTsConfig } from './lib/update-tsconfig';


const projectType = ProjectType.Library;

interface NormalizedMakeLibBuildableSchema extends MakeLibBuildableSchema {
  projectRoot: string;
}

function normalize(
  options: MakeLibBuildableSchema,
  stencilProjectConfig
): NormalizedMakeLibBuildableSchema {
  return { ...options, projectRoot: stencilProjectConfig.root };
}

function createFiles(host: Tree, options: MakeLibBuildableSchema) {
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
  const stencilProjectConfig = readProjectConfiguration(host, options.name);

  const targets = {};
  targets['build'] = getBuildTarget(projectType, options);
  targets['serve'] = getServeTarget(projectType, options);
  targets['e2e'] = getE2eTarget(projectType, options);

  stencilProjectConfig.targets = {
    ...stencilProjectConfig.targets,
    ...targets
  }

  updateProjectConfiguration(host, options.name, stencilProjectConfig);
}

export async function makeLibBuildableGenerator(host: Tree, schema: MakeLibBuildableSchema) {
  const stencilProjectConfig = readProjectConfiguration(host, schema.name);
  const options = normalize(schema, stencilProjectConfig);

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
          dir: '${offsetFromRoot(options.projectRoot)}dist/${
        options.projectRoot
      }/dist',
        }`
    ],
    join(options.projectRoot, 'stencil.config.ts')
  );

  updateTsConfig(host, options);

  if(!options.skipFormat) {
    await formatFiles(host);
  }
}

export default makeLibBuildableGenerator;
export const makeLibBuildableSchematic = convertNxGenerator(makeLibBuildableGenerator);
