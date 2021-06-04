import { ProjectType } from '@nrwl/workspace';
import {
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  updateProjectConfiguration,
  formatFiles,
  Tree
} from '@nrwl/devkit';
import { MakeLibBuildableSchema } from './schema';
import { addStylePluginToConfigInTree } from '../../stencil-core-utils/lib/devkit/style-plugins';
import { addToOutputTargetsInTree } from '../../stencil-core-utils/lib/devkit/plugins';
import { updateTsConfig } from './lib/update-tsconfig';
import { join } from 'path';
import { getBuildTarget, getE2eTarget, getServeTarget } from '../../utils/targets';

const projectType = ProjectType.Library;

interface MakeLibBuildableOptions extends MakeLibBuildableSchema {
  projectRoot: string;
}

function normalize(
  options: MakeLibBuildableSchema,
  projectRoot: string
): MakeLibBuildableOptions {
  return { ...options, projectRoot };
}

function createFiles(host: Tree, options: MakeLibBuildableOptions) {
  generateFiles(
    host,
    join(__dirname, './files/lib'),
    options.projectRoot,
    options
  );
}

function updateProjectConfig(host: Tree, options: MakeLibBuildableOptions) {
  const projectConfig = readProjectConfiguration(host, options.name);

  projectConfig.targets = projectConfig.targets || {};
  projectConfig.targets.build = getBuildTarget(projectType, options);
  projectConfig.targets.serve = getServeTarget(projectType, options);
  projectConfig.targets.e2e = getE2eTarget(projectType, options);

  updateProjectConfiguration(host, options.name, projectConfig);
}

export async function makeLibBuildableGenerator(host: Tree, schema: MakeLibBuildableSchema) {
  const stencilProjectConfig = readProjectConfiguration(host, schema.name);
  const options = normalize(schema, stencilProjectConfig.root);

  updateProjectConfig(host, options);
  createFiles(host, options);
  addStylePluginToConfigInTree(
    host,
    joinPathFragments(options.projectRoot, 'stencil.config.ts'),
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
    joinPathFragments(options.projectRoot, 'stencil.config.ts')
  );
  updateTsConfig(host, options);

  await formatFiles(host);
}

export default makeLibBuildableGenerator;
export const makeLibBuildableSchematic = convertNxGenerator(makeLibBuildableGenerator);
