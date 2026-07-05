import {
  formatFiles,
  names,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
} from '@nx/devkit';
import { NormalizedSchema, Schema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { updateJestConfig } from './lib/update-jest-config';
import { createFiles } from './lib/create-project-files';
import { assertNotUsingTsSolutionSetup } from '@nx/js/internal';
import {
  addViteApplication,
  configureViteFrameworkPlugin,
  addJestConfiguration,
  addCypressApplication,
  addEslintLintProject,
  normalizeViteAppCore,
  ViteFrameworkConfig,
} from '@nxext/common';
import { extraEslintDependencies } from '../utils/lint';

const SOLID_VITE_CONFIG: ViteFrameworkConfig = {
  frameworkName: 'solid',
  plugin: {
    importStatement: `import solidPlugin from 'vite-plugin-solid'`,
    pluginCallExpression: 'solidPlugin()',
  },
};

async function normalizeOptions<T extends Schema = Schema>(
  host: Tree,
  options: Schema
): Promise<NormalizedSchema<T>> {
  const {
    projectName,
    projectRoot,
    parsedTags,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
  } = await normalizeViteAppCore(
    host,
    {
      name: options.name,
      directory: options.directory,
      tags: options.tags,
      rootProject: options.rootProject,
    },
    'application'
  );
  options.name ??= projectName;
  options.rootProject = projectRoot === '.';
  // `fileName` is derived the same way `determineProjectNameAndRootOptions`
  // computes `names.projectFileName` internally (scope-stripped, joined
  // with '-'); kept local since normalizeViteAppCore intentionally doesn't
  // expose it (see design doc 0/1.1 — fileName semantics diverge per
  // framework).
  const fileName = projectName.startsWith('@')
    ? projectName.split('/').slice(1).join('-')
    : projectName;

  return {
    ...options,
    name: names(options.name).fileName,
    projectName,
    appProjectRoot: projectRoot,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
    parsedTags,
    fileName,
    skipFormat: false,
  };
}

export async function applicationGenerator(
  host: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  return await applicationGeneratorInternal(host, {
    ...schema,
  });
}

export async function applicationGeneratorInternal(tree: Tree, schema: Schema) {
  assertNotUsingTsSolutionSetup(tree, '@nxext/solid', 'application');

  const options = await normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });

  addProject(tree, options);
  createFiles(tree, options);

  const viteTask = await addViteApplication(tree, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  configureViteFrameworkPlugin(
    tree,
    {
      project: options.projectName,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
    },
    SOLID_VITE_CONFIG
  );

  const lintTask = await addEslintLintProject(
    tree,
    {
      linter: options.linter,
      projectName: options.name,
      projectRoot: options.appProjectRoot,
      tsConfigFileName: 'tsconfig.app.json',
    },
    extraEslintDependencies
  );
  const jestTask = await addJestConfiguration(tree, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  const cypressTask = await addCypressApplication(tree, {
    projectName: options.projectName,
    e2eTestRunner: options.e2eTestRunner,
    e2eProjectName: options.e2eProjectName,
    e2eProjectRoot: options.e2eProjectRoot,
    e2eWebServerAddress: options.e2eWebServerAddress,
    e2eWebServerTarget: options.e2eWebServerTarget,
    rootProject: options.rootProject,
  });

  updateJestConfig(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
