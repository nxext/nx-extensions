import {
  convertNxGenerator,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
  formatFiles,
  Tree,
} from '@nx/devkit';
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
import { getProjectTsImportPath } from '../storybook-configuration/generator';

function normalize(
  host: Tree,
  options: MakeLibBuildableSchema
): MakeLibBuildableSchema {
  options.projectRoot = readProjectConfiguration(host, options.name).root;

  options.importPath =
    options.importPath || getProjectTsImportPath(host, options.name);

  return { ...options } as MakeLibBuildableSchema;
}

function createFiles(host: Tree, options: MakeLibBuildableSchema) {
  generateFiles(
    host,
    joinPathFragments(__dirname, './files/lib'),
    options.projectRoot,
    options
  );
}

function updateProjectConfig(host: Tree, options: MakeLibBuildableSchema) {
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
  const options = normalize(host, schema);

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
      `{
        type: 'dist-hydrate-script',
        dir: 'dist/hydrate',
      }`,
      `{
        type: 'dist-custom-elements',
        autoDefineCustomElements: true,
        includeGlobalScripts: false,
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
