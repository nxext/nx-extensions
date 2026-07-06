import { PreactLibrarySchema } from './schema';
import { initGenerator } from '../init/init';
import { addProject } from './lib/add-project';
import {
  formatFiles,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
  joinPathFragments,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { addLinting } from './lib/add-linting';
import { addJest } from './lib/add-jest';
import { addVite } from './lib/add-vite';
import { normalizeOptions } from './lib/normalize-options';
import { createFiles } from './lib/create-files';
import { updateNpmScopeIfBuildableOrPublishable } from './lib/update-npm-scope';
import { maybeAddTsConfigPath, wireTsSolutionProject } from '@nxext/common';

export async function libraryGenerator(
  host: Tree,
  schema: PreactLibrarySchema,
) {
  if (schema.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`,
    );
  }

  const options = await normalizeOptions(host, schema);

  const tasks: GeneratorCallback[] = [];

  // `jsInitGenerator`'s own `tsConfigName` handling only fires when no root
  // tsconfig exists yet (`schema.addTsConfigBase && !getRootTsConfigFileName(tree)`,
  // `@nx/js`'s `init.js`) - in both legacy and TS-solution workspaces the
  // root tsconfig(.base).json already exists by the time a plugin generator
  // runs, so this call is a no-op for tsconfig purposes in either mode and
  // needs no `tsConfigName`/TS-solution-aware adjustment (see report).
  tasks.push(
    await jsInitGenerator(host, {
      ...schema,
      skipFormat: true,
    }),
  );

  tasks.push(await initGenerator(host, { ...options, skipFormat: true }));

  addProject(host, options);
  createFiles(host, options);

  if (options.isUsingTsSolutionConfig) {
    // The runtime tsconfig.lib.json must already exist on disk (written by
    // createFiles above) before `updateTsconfigFiles` can patch it - see
    // Design 1.3/`@nxext/common`'s `wireTsSolutionProject`. JSX settings
    // mirror the values already baked into
    // `files/non-ts-solution/tsconfig.json.template` (classic preact
    // runtime: `jsxFactory: 'h'`, not the automatic `react-jsx` transform).
    await wireTsSolutionProject(
      host,
      options.projectRoot,
      'tsconfig.lib.json',
      {
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        jsx: 'preserve',
        jsxFactory: 'h',
        jsxFragmentFactory: 'Fragment',
        jsxImportSource: 'preact',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        types: ['vite/client'],
      },
    );
  }

  tasks.push(await addVite(host, options));
  tasks.push(await addLinting(host, options));
  tasks.push(await addJest(host, options));

  updateNpmScopeIfBuildableOrPublishable(host, options);

  maybeAddTsConfigPath(
    host,
    options.importPath,
    [joinPathFragments(options.projectRoot, './src', 'index.ts')],
    options.isUsingTsSolutionConfig,
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default libraryGenerator;
