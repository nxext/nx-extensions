import {
  formatFiles,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
} from '@nx/devkit';
import {
  addViteApplication,
  configureViteFrameworkPlugin,
  addJestConfiguration,
  addCypressApplication,
  ViteFrameworkConfig,
  wireTsSolutionProject,
} from '@nxext/common';
import { Schema } from './schema';
import { addProject } from './lib/add-project';
import { initGenerator } from '../init/init';
import { addLinting } from './lib/add-linting';
import { updateJestConfig } from './lib/update-jest-config';
import { createApplicationFiles } from './lib/create-project-files';
import { normalizeOptions } from './lib/normalize-options';

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

export async function applicationGenerator(
  host: Tree,
  schema: Schema,
): Promise<GeneratorCallback> {
  return await applicationGeneratorInternal(host, {
    ...schema,
  });
}

export async function applicationGeneratorInternal(host: Tree, schema: Schema) {
  const options = await normalizeOptions(host, schema);

  const initTask = await initGenerator(host, { ...options, skipFormat: true });

  addProject(host, options);
  await createApplicationFiles(host, options);

  if (options.isUsingTsSolutionConfig) {
    // The runtime tsconfig.app.json must already exist on disk (written by
    // createApplicationFiles above) before `updateTsconfigFiles` can patch
    // it - see Design 1.3/`@nxext/common`'s `wireTsSolutionProject`.
    // compilerOptions mirror what @nx/vue passes for its own vite-based
    // application/library generators (application.js:109-115), minus the
    // jsx-specific entries svelte has no use for.
    await wireTsSolutionProject(
      host,
      options.projectRoot,
      'tsconfig.app.json',
      {
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
      },
    );
  }

  const viteTask = await addViteApplication(host, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  const includeVitest = options.unitTestRunner === 'vitest';
  configureViteFrameworkPlugin(
    host,
    {
      project: options.name,
      includeLib: false,
      includeVitest,
    },
    SVELTE_VITE_CONFIG,
  );

  const lintTask = await addLinting(host, options);
  const jestTask = await addJestConfiguration(host, {
    projectName: options.name,
    unitTestRunner: options.unitTestRunner,
  });
  const cypressTask = await addCypressApplication(host, options);

  updateJestConfig(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(initTask, viteTask, lintTask, jestTask, cypressTask);
}

export default applicationGenerator;
