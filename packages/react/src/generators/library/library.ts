import {
  convertNxGenerator,
  formatFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  normalizePath,
  Tree,
  generateFiles,
  updateProjectConfiguration,
  readProjectConfiguration,
  offsetFromRoot,
  addDependenciesToPackageJson,
  updateJson,
} from '@nrwl/devkit';
import { NormalizedSchema, Schema } from './schema';
import { libraryGenerator as nxLibraryGenerator } from '@nrwl/react';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addVitest } from './lib/add-vitest';
import { vitePluginReactVersion } from '../utils/versions';

function updateLibPackageNpmScope(
  host: Tree,
  projectRoot: string,
  projectName: string
) {
  return updateJson(host, `${projectRoot}/package.json`, (json) => {
    const name = names(projectName).fileName;
    (json.main = `./${name}.umd.js`),
      (json.module = `./${name}.es.js`),
      (json.exports = {
        '.': {
          import: `./${name}.es.js`,
          require: `./${name}.umd.js`,
        },
      });
    return json;
  });
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;
  const { libsDir } = getWorkspaceLayout(tree);
  const projectRoot = normalizePath(`${libsDir}/${projectDirectory}`);
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectRoot,
    projectName,
    parsedTags,
  };
}

export async function libraryGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(tree, schema);

  const libraryTask = await nxLibraryGenerator(tree, {
    ...options,
    unitTestRunner:
      options.unitTestRunner === 'vitest' ? 'none' : options.unitTestRunner,
    skipTsConfig: false,
  });
  const vitestTask = await addVitest(tree, options);

  tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.lib.json'));
  tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.json'));

  if (options.publishable || options.buildable) {
    const projectConfig = readProjectConfiguration(tree, options.projectName);
    updateProjectConfiguration(tree, options.projectName, {
      ...projectConfig,
      targets: {
        ...projectConfig.targets,
        build: {
          ...projectConfig.targets.build,
          executor: '@nxext/vite:package',
          outputs: ['{options.outputPath}'],
          options: {
            outputPath: joinPathFragments('dist', options.projectRoot),
            configFile: '@nxext/vite/plugins/vite-package',
            frameworkConfigFile: '@nxext/react/plugins/vite',
            entryFile: joinPathFragments('src', 'index.ts'),
          },
        },
      },
    });
  }

  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    projectName: options.projectName,
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    options.projectRoot,
    templateVariables
  );
  const installTask = addDependenciesToPackageJson(
    tree,
    {},
    {
      '@vitejs/plugin-react': vitePluginReactVersion,
    }
  );

  if (options.publishable || options.buildable) {
    updateLibPackageNpmScope(tree, options.projectRoot, options.projectName);
  }
  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(libraryTask, installTask, vitestTask);
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
