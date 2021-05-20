import {
  convertNxGenerator, formatFiles,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree
} from '@nrwl/devkit';
import { LibrarySchema, NormalizedLibrarySchema } from './schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utils';
import { initGenerator } from '../init/init';
import { updateTsConfig } from './lib/update-tsconfig';
import { join } from 'path';
import { makeLibBuildableGenerator } from '../make-lib-buildable/make-lib-buildable';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addProject } from './lib/add-project';

function normalizeOptions(host: Tree, options: LibrarySchema): NormalizedLibrarySchema {
  const { libsDir, npmScope } = getWorkspaceLayout(host);
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.library;
  const importPath = options.importPath || `@${npmScope}/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
    importPath
  } as NormalizedLibrarySchema;
}

function createFiles(host: Tree, options: NormalizedLibrarySchema) {
  generateFiles(
    host,
    join(__dirname, './files/lib'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot)
    }
  );
}

export async function libraryGenerator(host: Tree, schema: LibrarySchema) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(host, schema);
  if (options.publishable === true && !options.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }
  const initTask = await initGenerator(host, options);
  tasks.push(initTask);

  createFiles(host, options);
  addProject(host, options);
  updateTsConfig(host, options);

  if(options.buildable || options.publishable) {
    const makeBuildableTask = await makeLibBuildableGenerator(host, {
      name: options.projectName,
      importPath: options.importPath,
      style: options.style
    });
    tasks.push(makeBuildableTask);
  }

  if(!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
