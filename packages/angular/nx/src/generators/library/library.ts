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
  updateJson,
} from '@nrwl/devkit';
import { Schema } from './schema';
import { libraryGenerator as NxLibraryGenerator } from '@nrwl/angular/generators';
import { angularInitGenerator } from '../init/init';
import { E2eTestRunner } from '@nrwl/angular/src/utils/test-runners';

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

  await angularInitGenerator(tree, {
    linter: options.linter,
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
    e2eTestRunner: E2eTestRunner.Cypress,
    skipInstall: false,
    style: 'css',
  });

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { libsDir } = getWorkspaceLayout(tree);
  const libProjectRoot = normalizePath(`${libsDir}/${appDirectory}`);

  await NxLibraryGenerator(tree, { ...options });
  tree.delete(joinPathFragments(libProjectRoot, 'tsconfig.lib.json'));
  tree.delete(joinPathFragments(libProjectRoot, 'tsconfig.json'));

  const projectConfig = readProjectConfiguration(tree, appProjectName);
  updateProjectConfiguration(tree, appProjectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets.build,
        executor:
          options.publishable || options.buildable
            ? '@nxext/vite:package'
            : '@nxext/vite:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: joinPathFragments('dist', libProjectRoot),
          configFile: '@nxext/vite/plugins/vite-package',
          frameworkConfigFile: '@nxext/angular-vite/src/lib/vite',
          entryFile: joinPathFragments('src', 'index.ts'),
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

  if (options.publishable || options.buildable) {
    updateLibPackageNpmScope(tree, libProjectRoot, appProjectName);
  }
  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
