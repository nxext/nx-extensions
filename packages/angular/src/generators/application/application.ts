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
  StringChange,
  ChangeType,
  GeneratorCallback,
} from '@nrwl/devkit';
import { Schema } from './schema';
import { applicationGenerator as nxApplicationGenerator } from '@nrwl/angular/generators';
import { E2eTestRunner } from '@nrwl/angular/src/utils/test-runners';
import { SourceFile } from 'typescript';
import { angularInitGenerator } from '../init/init';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export function addImport(
  source: SourceFile,
  statement: string
): StringChange[] {
  return [
    {
      type: ChangeType.Insert,
      index: 0,
      text: `\n${statement}\n`,
    },
  ];
}

export async function applicationGenerator(tree: Tree, options: Schema) {
  const initTask = await angularInitGenerator(tree, {
    linter: options.linter,
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
    e2eTestRunner: E2eTestRunner.Cypress,
    skipInstall: false,
    style: 'css',
  });

  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const { appsDir } = getWorkspaceLayout(tree);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  const angularAppTask = await nxApplicationGenerator(tree, {
    ...options,
    e2eTestRunner: E2eTestRunner.None,
  });

  const completeEditing = async () => {
    tree.delete(joinPathFragments(appProjectRoot, 'tsconfig.app.json'));
    tree.delete(joinPathFragments(appProjectRoot, 'tsconfig.spec.json'));
    tree.delete(joinPathFragments(appProjectRoot, 'tsconfig.json'));
    tree.delete(joinPathFragments(appProjectRoot, 'src', 'index.html'));

    const projectConfig = readProjectConfiguration(tree, appProjectName);
    updateProjectConfiguration(tree, appProjectName, {
      ...projectConfig,
      targets: {
        ...projectConfig.targets,
        build: {
          ...projectConfig.targets.build,
          executor: '@nxext/vite:build',
          outputs: ['{options.outputPath}'],
          defaultConfiguration: 'production',
          options: {
            outputPath: joinPathFragments('dist', appProjectRoot),
            baseHref: '/',
            configFile: '@nxext/vite/plugins/vite',
            frameworkConfigFile: '@nxext/angular/plugins/vite',
          },
        },
        serve: {
          ...projectConfig.targets.serve,
          executor: '@nxext/vite:dev',
          options: {
            outputPath: joinPathFragments('dist', appProjectRoot),
            baseHref: '/',
            configFile: '@nxext/vite/plugins/vite',
            frameworkConfigFile: '@nxext/angular/plugins/vite',
          },
        },
      },
    });
    const templateVariables = {
      ...names(options.name),
      ...options,
      tmpl: '',
      offsetFromRoot: offsetFromRoot(appProjectRoot),
      projectName: appProjectName,
    };

    generateFiles(
      tree,
      joinPathFragments(__dirname, './files'),
      appProjectRoot,
      templateVariables
    );
    if (!options.skipFormat) {
      await formatFiles(tree);
    }

    const callback: GeneratorCallback = () => {};

    return Promise.resolve(callback);
  };

  const finished = await completeEditing();

  return runTasksInSerial(initTask, angularAppTask, finished);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
