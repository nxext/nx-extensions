import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema, SolidApplicationSchema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';

function normalizeOptions(
  tree: Tree,
  options: SolidApplicationSchema
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

  return {
    ...options,
    name: projectName,
    projectRoot,
    parsedTags,
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
  schema: SolidApplicationSchema
) {
  const options = normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });

  addProject(tree, options);
  createFiles(tree, options);

  const lintTask = await addLinting(tree, options);
  const jestTask = await addJest(tree, options);
  const cypressTask = await addCypress(tree, options);
  updateJestConfig(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
