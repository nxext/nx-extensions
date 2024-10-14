import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { LibrarySchema, RawLibrarySchema } from './schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/utillities';
import { initGenerator } from '../../generators/init/init';
import { MakeLibBuildableSchema } from '../../generators/make-lib-buildable/schema';
import { updateTsConfig } from './lib/update-tsconfig';
import { addProject } from './lib/add-project';
import { makeLibBuildableGenerator } from '../../generators/make-lib-buildable/make-lib-buildable';
import {
  determineProjectNameAndRootOptions,
  ensureProjectName,
} from '@nx/devkit/src/generators/project-name-and-root-utils';

async function normalizeOptions(
  host: Tree,
  options: RawLibrarySchema
): Promise<LibrarySchema> {
  await ensureProjectName(host, options, 'library');
  const {
    projectName,
    names: projectNames,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'library',
    directory: options.directory,
    importPath: options.importPath,
  });

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.library;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory: projectRoot,
    parsedTags,
    style,
    appType,
    importPath,
  } as LibrarySchema;
}

function createFiles(host: Tree, options: LibrarySchema) {
  generateFiles(
    host,
    joinPathFragments(__dirname, './files/lib'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
    }
  );

  if (options.unitTestRunner === 'none') {
    host.delete(
      `${options.projectRoot}/src/components/my-component/my-component.spec.ts`
    );
  }

  if (!options.component) {
    host.delete(`${options.projectRoot}/src/components/my-component`);
  }
}

export async function libraryGenerator(host: Tree, schema: RawLibrarySchema) {
  const options = await normalizeOptions(host, schema);

  if (options.publishable === true && !options.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }
  const initTask = await initGenerator(host, options);

  addProject(host, options);
  createFiles(host, options);
  updateTsConfig(host, options);

  if (options.buildable || options.publishable) {
    await makeLibBuildableGenerator(host, {
      name: options.projectName,
      importPath: options.importPath,
      style: options.style,
    } as MakeLibBuildableSchema);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask);
}
