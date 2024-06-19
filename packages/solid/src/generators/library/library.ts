import { NormalizedSchema, SolidLibrarySchema } from './schema';
import { initGenerator } from '../init/init';
import { addProject } from './lib/add-project';
import { updateTsConfig } from './lib/update-tsconfig';
import {
  formatFiles,
  names,
  Tree,
  updateJson,
  runTasksInSerial,
} from '@nx/devkit';
import { addLinting } from './lib/add-linting';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { createFiles } from './lib/create-project-files';
import { addVite } from './lib/add-vite';
import { addVitest } from './lib/add-vitest';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { createOrEditViteConfig } from '@nx/vite';

async function normalizeOptions(
  host: Tree,
  options: SolidLibrarySchema
): Promise<NormalizedSchema> {
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
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    callingGenerator: '@nxext/solid:library',
  });
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const fileName = options.simpleName
    ? projectNames.projectSimpleName
    : projectNames.projectFileName;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    inSourceTests: false,
    name: projectName,
    projectRoot,
    parsedTags,
    fileName,
    projectDirectory,
    importPath,
  };
}

function updateLibPackageNpmScope(host: Tree, options: NormalizedSchema) {
  if (options.publishable || options.buildable) {
    updateJson(host, `${options.projectRoot}/package.json`, (json) => {
      json.name = options.importPath;
      return json;
    });
  }
}

export async function libraryGenerator(host: Tree, schema: SolidLibrarySchema) {
  return await libraryGeneratorInternal(host, {
    projectNameAndRootFormat: 'derived',
    ...schema,
  });
}

export async function libraryGeneratorInternal(
  host: Tree,
  schema: SolidLibrarySchema
) {
  const options = await normalizeOptions(host, schema);
  if (options.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  const initTask = await initGenerator(host, { ...options, skipFormat: true });

  addProject(host, options);
  createFiles(host, options);

  const lintTask = await addLinting(host, options);
  const jestTask = await addJest(host, options);
  const viteTask = await addVite(host, options);
  createOrEditViteConfig(
    host,
    {
      project: options.name,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      rollupOptionsExternal: [],
      imports: [`import solidPlugin from 'vite-plugin-solid'`],
      plugins: [`solidPlugin()`],
    },
    false
  );

  const vitestTask = await addVitest(host, options);

  updateTsConfig(host, options);
  updateJestConfig(host, options);
  updateLibPackageNpmScope(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, vitestTask, lintTask, jestTask);
}
