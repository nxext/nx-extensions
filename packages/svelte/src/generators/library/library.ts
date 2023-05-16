import { NormalizedSchema, SvelteLibrarySchema } from './schema';
import { initGenerator } from '../init/init';
import { addProject } from './lib/add-project';
import { updateTsConfig } from './lib/update-tsconfig';
import {
  convertNxGenerator,
  formatFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
  updateJson,
  runTasksInSerial,
} from '@nx/devkit';
import { addLinting } from './lib/add-linting';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { addVite } from './lib/add-vite';
import { updateViteConfig } from './lib/update-vite-config';
import { createProjectFiles } from './lib/create-project-files';
import { addVitest } from './lib/add-vitest';

function normalizeOptions(
  tree: Tree,
  options: SvelteLibrarySchema
): NormalizedSchema {
  const { libsDir, npmScope } = getWorkspaceLayout(tree);
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const fileName = projectName;
  const projectRoot = joinPathFragments(`${libsDir}/${projectDirectory}`);
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const importPath = options.importPath || `@${npmScope}/${projectDirectory}`;

  return {
    ...options,
    name: projectName,
    projectRoot,
    parsedTags,
    fileName,
    projectDirectory,
    importPath,
  };
}

function updateLibPackageNpmScope(host: Tree, options: NormalizedSchema) {
  return updateJson(host, `${options.projectRoot}/package.json`, (json) => {
    json.name = options.importPath;
    return json;
  });
}

export async function libraryGenerator(
  host: Tree,
  schema: SvelteLibrarySchema
) {
  const options = normalizeOptions(host, schema);
  if (options.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  const initTask = await initGenerator(host, { ...options, skipFormat: true });

  addProject(host, options);
  await createProjectFiles(host, options);

  const lintTask = await addLinting(host, options);
  const jestTask = await addJest(host, options);
  const viteTask = await addVite(host, options);
  const vitestTask = await addVitest(host, options);

  updateTsConfig(host, options);
  updateViteConfig(host, options);
  updateJestConfig(host, options);

  if (options.publishable || options.buildable) {
    updateLibPackageNpmScope(host, options);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, lintTask, viteTask, jestTask, vitestTask);
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
