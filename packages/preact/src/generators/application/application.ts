import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import {
  addCypressApplication,
  addEslintLintProject,
  addJestConfiguration,
  addViteApplication,
  configureViteFrameworkPlugin,
  normalizeViteAppCore,
} from '@nxext/common';
import { NormalizedSchema, PreactApplicationSchema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { updateJestConfig } from './lib/update-jest-config';
import { extraEslintDependencies } from '../utils/lint';
import { preactViteFrameworkConfig } from '../utils/vite-config';
import { assertNotUsingTsSolutionSetup } from '@nx/js/internal';

async function normalizeOptions(
  tree: Tree,
  options: PreactApplicationSchema
): Promise<NormalizedSchema> {
  const core = await normalizeViteAppCore(
    tree,
    {
      name: options.name,
      directory: options.directory,
      tags: options.tags,
      // preact's schema has no `rootProject` option -> always undefined,
      // which reproduces today's hardcoded "non-root" behavior.
      rootProject: undefined,
    },
    'application'
  );

  // fileName stays a local computation (kept in sync with the
  // `projectFileName` logic from `determineProjectNameAndRootOptions`),
  // since `normalizeViteAppCore` intentionally doesn't expose it.
  const fileName = core.projectName.startsWith('@')
    ? core.projectName.split('/').slice(1).join('-')
    : core.projectName;

  return {
    ...options,
    // preact keeps `name` un-normalized (raw project name, no casing).
    name: core.projectName,
    projectRoot: core.projectRoot,
    parsedTags: core.parsedTags,
    e2eWebServerTarget: core.e2eWebServerTarget,
    e2eWebServerAddress: core.e2eWebServerAddress,
    e2eProjectName: core.e2eProjectName,
    e2eProjectRoot: core.e2eProjectRoot,
    fileName,
    projectDirectory: core.projectRoot,
    skipFormat: false,
  };
}

function createFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
    }
  );

  host.delete(joinPathFragments(`${options.projectRoot}/public/index.html`));
}

export async function applicationGenerator(
  tree: Tree,
  schema: PreactApplicationSchema
) {
  assertNotUsingTsSolutionSetup(tree, '@nxext/preact', 'application');

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
      project: options.name,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
    },
    preactViteFrameworkConfig
  );

  const lintTask = await addEslintLintProject(
    tree,
    {
      linter: options.linter,
      projectName: options.name,
      projectRoot: options.projectRoot,
      tsConfigFileName: 'tsconfig.app.json',
    },
    extraEslintDependencies
  );
  const jestTask = await addJestConfiguration(tree, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  const cypressTask = await addCypressApplication(tree, {
    projectName: options.name,
    e2eTestRunner: options.e2eTestRunner,
    e2eProjectName: options.e2eProjectName,
    e2eProjectRoot: options.e2eProjectRoot,
    e2eWebServerAddress: options.e2eWebServerAddress,
    e2eWebServerTarget: options.e2eWebServerTarget,
  });
  updateJestConfig(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
