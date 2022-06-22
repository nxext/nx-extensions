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
import { Schema } from './schema';
import { libraryGenerator as nxLibraryGenerator } from '@nrwl/react';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import reactInitGenerator from '../init/init';
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

export async function libraryGenerator(tree: Tree, options: Schema) {
  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { libsDir } = getWorkspaceLayout(tree);
  const libProjectRoot = normalizePath(`${libsDir}/${appDirectory}`);

  const initTask = await reactInitGenerator(tree, options);

  const libraryTask = await nxLibraryGenerator(tree, {
    ...options,
    skipTsConfig: false,
  });

  tree.delete(joinPathFragments(libProjectRoot, 'tsconfig.lib.json'));
  tree.delete(joinPathFragments(libProjectRoot, 'tsconfig.json'));

  if (options.publishable || options.buildable) {
    const projectConfig = readProjectConfiguration(tree, appProjectName);
    updateProjectConfiguration(tree, appProjectName, {
      ...projectConfig,
      targets: {
        ...projectConfig.targets,
        build: {
          ...projectConfig.targets.build,
          executor: '@nxext/vite:package',
          outputs: ['{options.outputPath}'],
          options: {
            outputPath: joinPathFragments('dist', libProjectRoot),
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
    offsetFromRoot: offsetFromRoot(libProjectRoot),
    projectName: appProjectName,
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    libProjectRoot,
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
    updateLibPackageNpmScope(tree, libProjectRoot, appProjectName);
  }
  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, libraryTask, installTask);
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
