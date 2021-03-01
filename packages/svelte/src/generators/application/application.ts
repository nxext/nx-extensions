import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { NormalizedSchema, SvelteApplicationSchema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { cypressInitGenerator, cypressProjectGenerator } from '@nrwl/cypress';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addLinting } from './lib/add-linting';

function normalizeOptions(
  tree: Tree,
  options: SvelteApplicationSchema
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
}

export async function applicationGenerator(
  tree: Tree,
  schema: SvelteApplicationSchema
) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });
  tasks.push(initTask);

  addProject(tree, options);
  createFiles(tree, options);

  if (options.e2eTestRunner === 'cypress') {
    const cypressInitTask = await cypressInitGenerator(tree);
    tasks.push(cypressInitTask);

    const cypressProjectTask = await cypressProjectGenerator(tree, {
      name: options.name + '-e2e',
      project: options.name,
    });
    tasks.push(cypressProjectTask);
  }

  const lintTask = await addLinting(tree, options);
  tasks.push(lintTask);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
