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

  await (
    await nxLibraryGenerator(tree, { ...options, skipTsConfig: false })
  )();

  tree.delete(joinPathFragments(libProjectRoot, 'tsconfig.lib.json'));
  tree.delete(joinPathFragments(libProjectRoot, 'tsconfig.json'));

  const projectConfig = readProjectConfiguration(tree, options.name);
  updateProjectConfiguration(tree, options.name, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets.build,
        executor: options.publishable
          ? '@nxext/vite:package'
          : '@nxext/vite:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: joinPathFragments('dist', libProjectRoot),
          configFile: options.publishable
            ? '@nxext/vite/plugins/vite-package'
            : '@nxext/vite/plugins/vite',
          frameworkConfigFile: '@nxext/react/plugins/vite',
          ...(options.publishable
            ? { entryFile: joinPathFragments('src', 'index.ts') }
            : {}),
        },
      },
    },
  });
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
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@vitejs/plugin-react': '^1.1.0',
    }
  );

  if (options.publishable) {
    updateLibPackageNpmScope(tree, libProjectRoot, appProjectName);
  }
  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
