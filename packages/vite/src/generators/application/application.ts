import {
  extraEslintDependencies,
  createViteEslintJson,
} from '../../utils/lint';
import { NormalizedSchema, Schema } from './schema';
import { createApplicationFiles } from './lib/create-application-files';
import { normalizeOptions } from './lib/normalize-options';
import { addProject } from './lib/add-project';
import { addJest } from './lib/add-jest';
import { setDefaults } from './lib/set-defaults';
import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import viteInitGenerator from '../init/init';
import { lintProjectGenerator } from '@nx/linter';
import { addVitest } from './lib/add-vitest';

async function addLinting(host: Tree, options: NormalizedSchema) {
  const supportExt: Array<'ts' | 'tsx' | 'js' | 'jsx'> = ['ts', 'js'];
  if (options.supportJSX) {
    supportExt.push('tsx', 'jsx');
  }
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [
      `${options.projectRoot}/**/*.{${supportExt.join(',')}}`,
    ],
    skipFormat: true,
  });

  const viteEslintJson = createViteEslintJson(
    options.projectRoot,
    options.setParserOptionsProject,
    supportExt
  );

  updateJson(
    host,
    joinPathFragments(options.projectRoot, '.eslintrc.json'),
    () => viteEslintJson
  );

  return lintTask;
}

async function addLintDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );
}

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  const viteInitTask = await viteInitGenerator(host, {
    ...options,
    skipFormat: true,
  });

  createApplicationFiles(host, options);
  addProject(host, options);
  const lintTask = await addLinting(host, options);
  const lintDependenciesTask = await addLintDependencies(host);
  const jestTask = await addJest(host, options);
  const vitestTask = await addVitest(host, options);
  setDefaults(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(
    viteInitTask,
    lintTask,
    lintDependenciesTask,
    jestTask,
    vitestTask
  );
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
