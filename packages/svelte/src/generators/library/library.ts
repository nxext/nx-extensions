import { SvelteLibrarySchema } from './schema';
import { initGenerator } from '../init/init';
import { addProject } from './lib/add-project';
import {
  formatFiles,
  Tree,
  joinPathFragments,
  runTasksInSerial,
} from '@nx/devkit';
import { addLinting } from './lib/add-linting';
import { addJest } from './lib/add-jest';
import { updateJestConfig } from './lib/update-jest-config';
import { addVite } from './lib/add-vite';
import { addVitest } from './lib/add-vitest';
import { createProjectFiles } from './lib/create-project-files';
import { normalizeOptions } from './lib/normalize-options';
import {
  configureViteFrameworkPlugin,
  maybeAddTsConfigPath,
  updateLibPackageNpmScope,
  ViteFrameworkConfig,
  wireTsSolutionProject,
} from '@nxext/common';

const SVELTE_VITE_CONFIG: ViteFrameworkConfig = {
  frameworkName: 'svelte',
  plugin: {
    importStatement: `import { svelte } from '@sveltejs/vite-plugin-svelte'`,
    pluginCallExpression: 'svelte()',
  },
  extraPlugins: [
    {
      when: ({ includeVitest }) => includeVitest,
      // svelteTesting() no-ops outside `vitest` runs (it checks
      // process.env.VITEST) but is required for @testing-library/svelte v5:
      // it marks the package ssr.noExternal so vite-plugin-svelte can
      // transform its shipped .svelte sources, prefers the browser export
      // condition, and wires up DOM auto-cleanup. See
      // https://testing-library.com/docs/svelte-testing-library/setup
      importStatement: `import { svelteTesting } from '@testing-library/svelte/vite'`,
      pluginCallExpression: 'svelteTesting()',
    },
  ],
};

export async function libraryGenerator(
  host: Tree,
  schema: SvelteLibrarySchema,
) {
  const options = await normalizeOptions(host, schema);
  if (options.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`,
    );
  }

  const initTask = await initGenerator(host, { ...options, skipFormat: true });

  addProject(host, options);
  await createProjectFiles(host, options);

  if (options.isUsingTsSolutionConfig) {
    // The runtime tsconfig.lib.json must already exist on disk (written by
    // createProjectFiles above) before `updateTsconfigFiles` can patch it -
    // see Design 1.3/`@nxext/common`'s `wireTsSolutionProject`.
    // compilerOptions mirror what @nx/vue passes for its own vite-based
    // application/library generators (library.js:109-115), minus the
    // jsx-specific entries svelte has no use for.
    await wireTsSolutionProject(
      host,
      options.projectRoot,
      'tsconfig.lib.json',
      {
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
      },
    );
  }

  const lintTask = await addLinting(host, options);
  const jestTask = await addJest(host, options);
  const viteTask = await addVite(host, options);
  const includeVitest = options.unitTestRunner === 'vitest';
  configureViteFrameworkPlugin(
    host,
    {
      project: options.name,
      includeLib: true,
      includeVitest,
    },
    SVELTE_VITE_CONFIG,
  );

  const vitestTask = await addVitest(host, options);

  updateJestConfig(host, options);

  if (options.publishable || options.buildable) {
    updateLibPackageNpmScope(host, options);
  }

  maybeAddTsConfigPath(
    host,
    options.importPath,
    [joinPathFragments(options.projectRoot, './src', 'index.ts')],
    options.isUsingTsSolutionConfig,
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, lintTask, viteTask, jestTask, vitestTask);
}

export default libraryGenerator;
