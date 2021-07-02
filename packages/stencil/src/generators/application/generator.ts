import { AppType } from './../../utils/typings';
import { convertNxGenerator, generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree } from '@nrwl/devkit';
import { ApplicationSchema, RawApplicationSchema } from './schema';
import { calculateStyle } from '../../utils/utils';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { addStylePluginToConfig } from '../../stencil-core-utils';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addProject } from './lib/add-project';

function normalizeOptions(host: Tree, options: RawApplicationSchema): ApplicationSchema {
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
  generateFiles(
    host,
    join(__dirname, './files/app'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot)
    }
  );
}

export async function applicationGenerator(host: Tree, schema: RawApplicationSchema) {
  const options = normalizeOptions(host, schema);
  const initTask = await initGenerator(host, options);

  createFiles(host, options);
  addProject(host, options);

  addStylePluginToConfig(
    host,
    join(options.projectRoot, 'stencil.config.ts'),
    options.style
  );

  return runTasksInSerial(initTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
