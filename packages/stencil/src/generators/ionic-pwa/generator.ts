import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  Tree,
  runTasksInSerial,
  offsetFromRoot,
} from '@nx/devkit';
import { PWASchema, RawPWASchema } from './schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../init/init';
import { join } from 'path';
import { addStylePluginToConfig } from '../../stencil-core-utils';
import { addProject } from './lib/add-project';
import { addLinting } from '../application/lib/add-linting';

function normalizeOptions(options: RawPWASchema, host: Tree): PWASchema {
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
    appType,
  } as PWASchema;
}

function createFiles(host: Tree, options: PWASchema) {
  generateFiles(host, join(__dirname, './files/pwa'), options.projectRoot, {
    ...options,
    ...names(options.name),
    projectRoot: options.projectRoot,
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

function addStylePlugin(tree: Tree, normalizedOptions: PWASchema) {
  addStylePluginToConfig(
    tree,
    join(normalizedOptions.projectRoot, 'stencil.config.ts'),
    normalizedOptions.style
  );
}

export async function ionicPwaGenerator(host: Tree, schema: RawPWASchema) {
  const options = normalizeOptions(schema, host);
  const initTask = await initGenerator(host, options);
  createFiles(host, options);
  addStylePlugin(host, options);
  addProject(host, options);

  const lintTask = await addLinting(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }
  return runTasksInSerial(initTask, lintTask);
}

export default ionicPwaGenerator;
export const ionicPwaSchematic = convertNxGenerator(ionicPwaGenerator);
