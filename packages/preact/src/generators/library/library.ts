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
import { addVitest } from './lib/add-vitest';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';
import { normalizeOptions } from './lib/normalize-options';
import { createFiles } from './lib/create-files';
import { updateNpmScopeIfBuildableOrPublishable } from './lib/update-npm-scope';
import { addTsConfigPath } from '@nx/js';

export async function libraryGenerator(
  host: Tree,
  schema: PreactLibrarySchema
) {
  assertNotUsingTsSolutionSetup(host, '@nxext/preact', 'library');

  if (schema.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  const options = await normalizeOptions(host, schema);

  const tasks: GeneratorCallback[] = [];

  tasks.push(
    await jsInitGenerator(host, {
      ...schema,
      skipFormat: true,
    })
  );

  tasks.push(await initGenerator(host, { ...options, skipFormat: true }));

  addProject(host, options);
  createFiles(host, options);

  tasks.push(await addVite(host, options));
  tasks.push(await addVitest(host, options));
  tasks.push(await addLinting(host, options));
  tasks.push(await addJest(host, options));

  updateNpmScopeIfBuildableOrPublishable(host, options);

  addTsConfigPath(host, options.importPath, [
    joinPathFragments(options.projectRoot, './src', 'index.ts'),
  ]);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default libraryGenerator;
