import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';
import { VitestProjectGeneratorSchema } from './schema';
import vitestInitGenerator from '../init/init';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

interface NormalizedSchema extends VitestProjectGeneratorSchema {
  projectRoot: string;
}

function normalizeOptions(
  host: Tree,
  options: VitestProjectGeneratorSchema
): NormalizedSchema {
  const projectConfiguration = readProjectConfiguration(host, options.project);
  const projectRoot = projectConfiguration.root;

  return {
    ...options,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, `files_${options.framework}`),
    options.projectRoot,
    templateOptions
  );
}

function addVitestExecutor(host: Tree, options: NormalizedSchema) {
  const projectConfiguration = readProjectConfiguration(host, options.project);
  projectConfiguration.targets = {
    ...projectConfiguration.targets,
    test: {
      executor: '@nxext/vitest:vitest',
      options: {
        command: 'run',
      },
    },
  };
  updateProjectConfiguration(host, options.project, projectConfiguration);
}

function addDependencies(host: Tree, options: NormalizedSchema) {
  if (options.framework !== 'react') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  return addDependenciesToPackageJson(host, {}, { 'happy-dom': '^2.55.0' });
}

export async function vitestProjectGenerator(
  host: Tree,
  options: VitestProjectGeneratorSchema
) {
  const initTask = vitestInitGenerator(host, {});
  const normalizedOptions = normalizeOptions(host, options);
  addFiles(host, normalizedOptions);
  addVitestExecutor(host, normalizedOptions);
  await formatFiles(host);

  const installTask = addDependencies(host, normalizedOptions);

  return runTasksInSerial(initTask, installTask);
}

export default vitestProjectGenerator;
export const vitestProjectSchematic = convertNxGenerator(
  vitestProjectGenerator
);
