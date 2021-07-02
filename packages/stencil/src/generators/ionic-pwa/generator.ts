import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  Tree,
  offsetFromRoot
} from '@nrwl/devkit';
import { PWASchema } from './schema';
import { InitSchema } from '../init/schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utils';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { addStylePluginToConfig } from '../../stencil-core-utils';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addProject } from './lib/add-project';

function normalizeOptions(options: InitSchema, host: Tree): PWASchema {
  const { appsDir } = getWorkspaceLayout(host);
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.pwa;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType
  } as PWASchema;
}

function createFiles(tree: Tree, options: PWASchema) {
  generateFiles(
    tree,
    join(__dirname, './files/pwa'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      projectRoot: options.projectRoot,
      offsetFromRoot: offsetFromRoot(options.projectRoot)
    }
  );
}

function addStylePlugin(tree: Tree, normalizedOptions: PWASchema) {
  addStylePluginToConfig(
    tree,
    join(normalizedOptions.projectRoot, 'stencil.config.ts'),
    normalizedOptions.style
  );
}

export async function ionicPwaGenerator(
  tree: Tree,
  schema: InitSchema
) {
  const options = normalizeOptions(schema, tree);
  const initTask = await initGenerator(tree, options);
  createFiles(tree, options);
  addStylePlugin(tree, options);
  addProject(tree, options);

  if (options.skipFormat) {
    await formatFiles(tree);
  }
  return runTasksInSerial(initTask);
}

export default ionicPwaGenerator;
export const ionicPwaSchematic = convertNxGenerator(ionicPwaGenerator);
