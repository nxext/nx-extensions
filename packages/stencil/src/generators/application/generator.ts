import { AppType } from './../../utils/typings';
import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { ApplicationSchema, RawApplicationSchema } from './schema';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { addProject } from './lib/add-project';
import { addLinting } from './lib/add-linting';
import { addCypress } from './lib/add-cypress';

function normalizeOptions(
  host: Tree,
  options: RawApplicationSchema
): ApplicationSchema {
  const { appsDir } = getWorkspaceLayout(host);
  const projectName = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${projectName}`
    : projectName;
  const projectRoot = `${appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);

  const appType = AppType.application;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
  };
}

function createFiles(host: Tree, options: ApplicationSchema) {
  generateFiles(host, join(__dirname, './files/app'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  });

  if (options.unitTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/app-home/app-home.spec.ts`
    );
    host.delete(
      `${options.projectRoot}/src/components/app-root/app-root.spec.ts`
    );
    host.delete(
      `${options.projectRoot}/src/components/app-profile/app-profile.spec.ts`
    );
  }
}

export async function applicationGenerator(
  host: Tree,
  schema: RawApplicationSchema
) {
  const options = normalizeOptions(host, schema);
  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });

  createFiles(host, options);
  addProject(host, options);
  const lintTask = await addLinting(host, options);
  const cypressTask = await addCypress(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, lintTask, cypressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
