import {
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  updateProjectConfiguration,
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import { MakeLibBuildableSchema } from './schema';
import { addStylePluginToConfig } from '../../stencil-core-utils';
import { addToOutputTargets } from '../../stencil-core-utils';
import { updateTsConfig } from './lib/update-tsconfig';
import {
  getBuildTarget,
  getE2eTarget,
  getLintTarget,
  getServeTarget,
} from '../../utils/targets';
import { AppType } from '../../utils/typings';

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
    joinPathFragments(__dirname, './files/lib'),
    options.projectRoot,
    options
  );
}

function updateProjectConfig(host: Tree, options: MakeLibBuildableOptions) {
  const projectConfig = readProjectConfiguration(host, options.name);

  projectConfig.targets = projectConfig.targets || {};
  projectConfig.targets.build = getBuildTarget(AppType.library, options);
  projectConfig.targets.serve = getServeTarget(AppType.library, options);
  projectConfig.targets.e2e = getE2eTarget(AppType.library, options);
  projectConfig.targets.lint = getLintTarget(
    AppType.library,
    options.projectRoot
  );

  updateProjectConfiguration(host, options.name, projectConfig);
}

export async function makeLibBuildableGenerator(
  host: Tree,
  schema: MakeLibBuildableSchema
) {
  const stencilProjectConfig = readProjectConfiguration(host, schema.name);
  const options = normalize(schema, stencilProjectConfig.root);

  updateProjectConfig(host, options);
  createFiles(host, options);
  addStylePluginToConfig(
    host,
    joinPathFragments(options.projectRoot, 'stencil.config.ts'),
    options.style
  );
  addToOutputTargets(
    host,
    [
      `{
        type: 'dist',
        esmLoaderPath: '../loader'
      }`,
      `{
        type: 'dist-custom-elements',
      }`,
      `{
        type: 'docs-readme',
      }`,
      `{
        type: 'www',
        serviceWorker: null // disable service workers
      }`,
    ],
    joinPathFragments(options.projectRoot, 'stencil.config.ts')
  );
  updateTsConfig(host, options);

  await formatFiles(host);
}

export default makeLibBuildableGenerator;
export const makeLibBuildableSchematic = convertNxGenerator(
  makeLibBuildableGenerator
);
