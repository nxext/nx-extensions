import {
  generateFiles,
  joinPathFragments,
  readJson,
  readProjectConfiguration,
  updateJson,
  updateProjectConfiguration,
  formatFiles,
  Tree,
} from '@nx/devkit';
import { MakeLibBuildableSchema } from './schema';
import { addStylePluginToConfig } from '../../stencil-core-utils';
import { addToOutputTargets } from '../../stencil-core-utils';
import { updateTsConfig } from './lib/update-tsconfig';
import { getLintTarget } from '../../utils/targets';
import { getProjectTsImportPath } from '../storybook-configuration/generator';

/**
 * Always the plain, scope-free project name - even when `options.name` (the
 * Nx project identifier) is the full scoped importPath in TS-solution mode
 * (Design 1.5). Used for Stencil's own generated `unpkg` bundle path, which
 * must never contain the npm scope.
 */
function toSimpleProjectName(name: string): string {
  return name.startsWith('@') ? name.split('/').pop() : name;
}

function normalize(
  host: Tree,
  options: MakeLibBuildableSchema,
): MakeLibBuildableSchema {
  options.projectRoot = readProjectConfiguration(host, options.name).root;

  options.importPath =
    options.importPath || getProjectTsImportPath(host, options.name);

  return {
    ...options,
    simpleProjectName: toSimpleProjectName(options.name),
  } as MakeLibBuildableSchema;
}

function createFiles(host: Tree, options: MakeLibBuildableSchema) {
  // In TS-solution mode the project's package.json already carries
  // `name`/`nx.targets`/`nx.generators` written by the library generator's
  // `addProjectPackageJson` call (Design 1.4). The template below
  // overwrites `package.json` wholesale with Stencil's dist-output shape,
  // which has no `nx` field at all - capture whatever was there beforehand
  // and reapply it afterwards so registration/target metadata survives
  // becoming buildable.
  const packageJsonPath = joinPathFragments(
    options.projectRoot,
    'package.json',
  );
  const priorNx = host.exists(packageJsonPath)
    ? readJson(host, packageJsonPath).nx
    : undefined;

  generateFiles(
    host,
    joinPathFragments(__dirname, './files/lib'),
    options.projectRoot,
    options,
  );

  if (priorNx) {
    updateJson(host, packageJsonPath, (json) => {
      json.nx = priorNx;
      return json;
    });
  }
}

function updateProjectConfig(host: Tree, options: MakeLibBuildableSchema) {
  const projectConfig = readProjectConfiguration(host, options.name);

  projectConfig.targets = projectConfig.targets || {};
  // `build` / `serve` / `e2e` are inferred by `@nxext/stencil/plugin` once the
  // new `stencil.config.ts` (written below in createFiles) is on disk.
  projectConfig.targets.lint = getLintTarget(options.projectRoot);

  updateProjectConfiguration(host, options.name, projectConfig);
}

export async function makeLibBuildableGenerator(
  host: Tree,
  schema: MakeLibBuildableSchema,
) {
  const options = normalize(host, schema);

  updateProjectConfig(host, options);
  createFiles(host, options);
  addStylePluginToConfig(
    host,
    joinPathFragments(options.projectRoot, 'stencil.config.ts'),
    options.style,
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
        customElementsExportBehavior: 'auto-define-custom-elements',
        includeGlobalScripts: false,
      }`,
    ],
    joinPathFragments(options.projectRoot, 'stencil.config.ts'),
  );
  updateTsConfig(host, options);

  await formatFiles(host);
}

export default makeLibBuildableGenerator;
