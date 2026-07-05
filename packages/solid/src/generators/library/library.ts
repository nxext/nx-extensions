import { NormalizedSchema, SolidLibrarySchema } from './schema';
import { initGenerator } from '../init/init';
import { addProject } from './lib/add-project';
import { updateTsConfig } from './lib/update-tsconfig';
import { formatFiles, Tree, runTasksInSerial } from '@nx/devkit';
import { addLinting } from './lib/add-linting';
import { updateJestConfig } from './lib/update-jest-config';
import { createFiles } from './lib/create-project-files';
import { addVite } from './lib/add-vite';
import { assertNotUsingTsSolutionSetup } from '@nx/js/internal';
import {
  addJestConfiguration,
  configureViteFrameworkPlugin,
  normalizeViteLibCore,
  shouldUpdateNpmScope,
  updateLibPackageNpmScope as updateLibPackageNpmScopeCore,
  ViteFrameworkConfig,
} from '@nxext/common';

const SOLID_VITE_CONFIG: ViteFrameworkConfig = {
  frameworkName: 'solid',
  plugin: {
    importStatement: `import solidPlugin from 'vite-plugin-solid'`,
    pluginCallExpression: 'solidPlugin()',
  },
};

async function normalizeOptions(
  host: Tree,
  options: SolidLibrarySchema
): Promise<NormalizedSchema> {
  const { projectName, projectRoot, parsedTags, importPath } =
    await normalizeViteLibCore(host, {
      name: options.name,
      directory: options.directory,
      tags: options.tags,
      importPath: options.importPath,
    });
  // `fileName` is derived the same way `determineProjectNameAndRootOptions`
  // computes `names.projectFileName`/`names.projectSimpleName` internally
  // (scope-stripped, joined with '-' or last segment); kept local since
  // normalizeViteLibCore intentionally doesn't expose it (see design doc
  // 0/1.1 — fileName semantics diverge per framework).
  const fileName = ((): string => {
    if (!projectName.startsWith('@')) {
      return projectName;
    }
    const segments = projectName.split('/').slice(1);
    return options.simpleName
      ? segments[segments.length - 1]
      : segments.join('-');
  })();

  return {
    ...options,
    inSourceTests: false,
    name: projectName,
    projectRoot,
    parsedTags,
    fileName,
    projectDirectory: projectRoot,
    importPath,
  };
}

function updateLibPackageNpmScope(host: Tree, options: NormalizedSchema) {
  if (shouldUpdateNpmScope(options)) {
    updateLibPackageNpmScopeCore(host, {
      projectRoot: options.projectRoot,
      importPath: options.importPath,
    });
  }
}

export async function libraryGenerator(host: Tree, schema: SolidLibrarySchema) {
  return await libraryGeneratorInternal(host, {
    ...schema,
  });
}

export async function libraryGeneratorInternal(
  host: Tree,
  schema: SolidLibrarySchema
) {
  assertNotUsingTsSolutionSetup(host, '@nxext/solid', 'library');

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
  const jestTask = await addJestConfiguration(host, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  const viteTask = await addVite(host, options);
  configureViteFrameworkPlugin(
    host,
    {
      project: options.name,
      includeLib: true,
      includeVitest: options.unitTestRunner === 'vitest',
    },
    SOLID_VITE_CONFIG
  );

  updateTsConfig(host, options);
  updateJestConfig(host, options);
  updateLibPackageNpmScope(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask);
}

export default libraryGenerator;
