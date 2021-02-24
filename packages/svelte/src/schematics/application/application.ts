import { projectRootDir, ProjectType } from '@nrwl/workspace';
import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback, getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree, updateJson
} from '@nrwl/devkit';
import { NormalizedSchema, SvelteApplicationSchema } from './schema';
import { _addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { cypressInitGenerator, cypressProjectGenerator } from '@nrwl/cypress';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { lintProjectGenerator } from '@nrwl/linter';
import { extraEslintDependencies, svelteEslintJson } from '../utils/lint';

function normalizeOptions(tree: Tree, options: SvelteApplicationSchema): NormalizedSchema {
  const { appsDir } = getWorkspaceLayout(tree);
  const name = names(options.name).fileName;
  const projectName = name.replace(new RegExp('/', 'g'), '-');
  const projectRoot = joinPathFragments(`${appsDir}/${projectName}`);
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    parsedTags,
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
      offsetFromRoot: offsetFromRoot(options.projectRoot)
    }
  );
}

async function addLinting(host: Tree, options: NormalizedSchema) {
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx,js,jsx}`],
    skipFormat: true,
  });

  updateJson(
    host,
    joinPathFragments(options.projectRoot, '.eslintrc.json'),
    (json) => {
      json = {...svelteEslintJson, ...json};
      return json;
    }
  );

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}

export async function applicationGenerator(tree: Tree, schema: SvelteApplicationSchema) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(tree, schema);

  const initTask = await initGenerator(tree, { ...options, skipFormat: true });
  tasks.push(initTask);

  _addProject(tree, options);
  createFiles(tree, options);

  if(options.e2eTestRunner === 'cypress') {
    const cypressInitTask = await cypressInitGenerator(tree);
    tasks.push(cypressInitTask);

    const cypressProjectTask = await cypressProjectGenerator(tree, {
      name: options.projectName + '-e2e',
      project: options.projectName,
    });
    tasks.push(cypressProjectTask);
  }

  const lintTask = await addLinting(tree, options);
  tasks.push(lintTask);

  if(!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
