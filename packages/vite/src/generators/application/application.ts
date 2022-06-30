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
  Tree,
  updateJson,
} from '@nxext/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import viteInitGenerator from '../init/init';
import { lintProjectGenerator } from '@nrwl/linter';

async function addLinting(host: Tree, options: NormalizedSchema) {
  const tasks: GeneratorCallback[] = [];
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
  tasks.push(lintTask);

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

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );
  tasks.push(installTask);

  return runTasksInSerial(...tasks);
}

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema),
    tasks: GeneratorCallback[] = [];

  tasks.push(
    await viteInitGenerator(host, {
      ...options,
      skipFormat: true,
    })
  );

  createApplicationFiles(host, options);
  addProject(host, options);
  tasks.push(await addLinting(host, options));
  tasks.push(await addJest(host, options));
  setDefaults(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
