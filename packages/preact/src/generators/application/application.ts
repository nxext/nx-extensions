import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
  readNxJson,
} from '@nx/devkit';
import { NormalizedSchema, PreactApplicationSchema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { addVite } from './lib/add-vite';
import { createOrEditViteConfig } from '@nx/vite';

function normalizeOptions(
  tree: Tree,
  options: PreactApplicationSchema
): NormalizedSchema {
  const { appsDir } = getWorkspaceLayout(tree);
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? joinPathFragments(`${names(options.directory).fileName}/${name}`)
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const fileName = projectName;
  const projectRoot = joinPathFragments(`${appsDir}/${projectDirectory}`);
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const nxJson = readNxJson(tree);

  let e2eWebServerTarget = 'serve';
  let e2ePort = 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    nxJson.targetDefaults?.[e2eWebServerTarget].options?.port
  ) {
    e2ePort = nxJson.targetDefaults?.[e2eWebServerTarget].options?.port;
  }

  const e2eProjectName = `${name}-e2e`;
  const e2eProjectRoot = `${projectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;

  return {
    ...options,
    name: projectName,
    projectRoot,
    parsedTags,
    e2eWebServerTarget,
    e2eWebServerAddress,
    e2eProjectName,
    e2eProjectRoot,
    fileName,
    projectDirectory,
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
  const options = normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });

  addProject(tree, options);
  createFiles(tree, options);

  const viteTask = await addVite(tree, options);
  createOrEditViteConfig(
    tree,
    {
      project: options.name,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      rollupOptionsExternal: [],
      imports: [`import preact from '@preact/preset-vite'`],
      plugins: [`preact()`],
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

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
