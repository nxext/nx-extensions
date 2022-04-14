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
} from '@nrwl/devkit';
import { NormalizedSchema, Schema } from './schema';
import { applicationGenerator as nxApplicationGenerator } from '@nrwl/react';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addVitest } from './lib/add-vitest';
import { vitePluginReactVersion } from '../utils/versions';

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;
  const { appsDir } = getWorkspaceLayout(tree);
  const projectRoot = normalizePath(`${appsDir}/${projectDirectory}`);
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

export async function applicationGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(tree, schema);
  const appTask = await nxApplicationGenerator(tree, {
    ...options,
    unitTestRunner:
      options.unitTestRunner === 'vitest' ? 'none' : options.unitTestRunner,
    e2eTestRunner: 'none',
  });
  const vitestTask = await addVitest(tree, options);

  tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.app.json'));
  tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.spec.json'));
  tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.json'));
  tree.delete(joinPathFragments(options.projectRoot, 'src', 'index.html'));
  tree.delete(
    joinPathFragments(
      options.projectRoot,
      'src',
      'app',
      `nx-welcome.${options.js ? 'jsx' : 'tsx'}`
    )
  );
  const fileName = options.pascalCaseFiles ? 'App' : 'app';
  tree.delete(
    joinPathFragments(
      options.projectRoot,
      'src',
      'app',
      `${fileName}.${options.js ? 'jsx' : 'tsx'}`
    )
  );
  const projectConfig = readProjectConfiguration(tree, options.projectName);
  updateProjectConfiguration(tree, options.projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets.build,
        executor: '@nxext/vite:build',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          outputPath: joinPathFragments('dist', options.projectRoot),
          baseHref: '/',
          configFile: '@nxext/vite/plugins/vite',
          frameworkConfigFile: '@nxext/react/plugins/vite',
        },
      },
      serve: {
        ...projectConfig.targets.serve,
        executor: '@nxext/vite:dev',
        options: {
          outputPath: joinPathFragments('dist', options.projectRoot),
          baseHref: '/',
          configFile: '@nxext/vite/plugins/vite',
          frameworkConfigFile: '@nxext/react/plugins/vite',
        },
      },
    },
  });
  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    projectName: options.projectName,
    fileName: fileName,
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
  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(appTask, installTask, vitestTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
