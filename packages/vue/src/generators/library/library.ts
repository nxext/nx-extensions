import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
  NX_VERSION,
} from '@nx/devkit';
import { Schema } from './schema';
import initGenerator from '../init/init';
import { normalizeOptions } from './lib/normalize-options';
import { updateViteConfig } from './lib/update-vite-config';
import { addProject } from './lib/add-project';
import { createLibraryFiles } from './lib/create-library-files';
import componentGenerator from '../component/component';
import { updateBaseTsConfig } from './lib/update-base-tsconfig';
import { addLinting } from './lib/add-linting';

export async function libraryGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(host, schema);

  if (options.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  addProject(host, options);
  createLibraryFiles(host, options);

  const initTask = await initGenerator(host, {
    ...options,
    routing: false,
    skipFormat: true,
  });
  tasks.push(initTask);

  updateBaseTsConfig(host, options);
  if (options.buildable) {
    await ensurePackage('@nx/vite', NX_VERSION);
    const { viteConfigurationGenerator } = await import('@nx/vite');
    const viteTask = await viteConfigurationGenerator(host, {
      uiFramework: 'none',
      project: options.projectName,
      newProject: true,
      includeLib: true,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: options.inSourceTests,
    });
    tasks.push(viteTask);

    updateViteConfig(host, options);
  }

  if (!options.buildable && options.unitTestRunner === 'vitest') {
    await ensurePackage('@nx/vite', NX_VERSION);
    const { vitestGenerator } = await import('@nx/vite');

    const vitestTask = await vitestGenerator(host, {
      uiFramework: 'none',
      project: options.projectName,
      coverageProvider: 'c8',
      inSourceTests: options.inSourceTests,
    });
    tasks.push(vitestTask);
    updateViteConfig(host, options);
  }

  const lintTask = await addLinting(host, options);
  tasks.push(lintTask);

  if (options.component) {
    const componentTask = await componentGenerator(host, {
      name: options.name,
      project: options.projectName,
      skipTests:
        options.unitTestRunner === 'none' ||
        (options.unitTestRunner === 'vitest' && options.inSourceTests == true),
      export: true,
    });
    tasks.push(componentTask);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
