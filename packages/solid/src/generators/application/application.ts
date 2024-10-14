import {
  formatFiles,
  names,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
  readNxJson,
} from '@nx/devkit';
import { createOrEditViteConfig } from '@nx/vite';
import { NormalizedSchema, Schema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { addVite } from './lib/add-vite';
import { createFiles } from './lib/create-project-files';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';

async function normalizeOptions<T extends Schema = Schema>(
  host: Tree,
  options: Schema
): Promise<NormalizedSchema<T>> {
  await ensureProjectName(host, options, 'application');
  const {
    projectName,
    projectRoot,
    names: projectNames,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'application',
    directory: options.directory,
    rootProject: options.rootProject,
  });
  options.rootProject = projectRoot === '.';
  const fileName =
    /* options.simpleName
    ? projectNames.projectSimpleName
    :  */ projectNames.projectFileName;

  const nxJson = readNxJson(host);

  let e2eWebServerTarget = 'serve';
  let e2ePort = 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    nxJson.targetDefaults?.[e2eWebServerTarget].options?.port
  ) {
    e2ePort = nxJson.targetDefaults?.[e2eWebServerTarget].options?.port;
  }

  const e2eProjectName = options.rootProject ? 'e2e' : `${projectName}-e2e`;
  const e2eProjectRoot = options.rootProject ? 'e2e' : `${projectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

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
  const options = await normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });

  addProject(tree, options);
  createFiles(tree, options);

  const viteTask = await addVite(tree, options);
  createOrEditViteConfig(
    tree,
    {
      project: options.projectName,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      rollupOptionsExternal: [],
      imports: [`import solidPlugin from 'vite-plugin-solid'`],
      plugins: [`solidPlugin()`],
    },
    false
  );

  const lintTask = await addLinting(tree, options);
  const jestTask = await addJest(tree, options);
  const cypressTask = await addCypress(tree, options);

  updateJestConfig(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}
