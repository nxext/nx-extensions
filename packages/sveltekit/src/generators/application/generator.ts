import {
  formatFiles,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
} from '@nx/devkit';
import { wireTsSolutionProject } from '@nxext/common';
import { SveltekitGeneratorSchema } from './schema';
import { addLinting } from './lib/add-linting';
import { installDependencies } from './lib/install-dependencies';
import { addFiles } from './lib/add-project-files';
import { addProject } from './lib/add-project';
import { addVite } from './lib/add-vite';
import { normalizeOptions } from './lib/normalize-options';
import { createOrEditViteConfig } from '@nx/vite';

export async function applicationGenerator(
  host: Tree,
  schema: SveltekitGeneratorSchema,
) {
  const tasks: GeneratorCallback[] = [];
  const options = await normalizeOptions(host, schema);

  addProject(host, options);
  addFiles(host, options);

  if (options.isUsingTsSolutionConfig) {
    // The runtime tsconfig.app.json must already exist on disk (written by
    // addFiles above) before `updateTsconfigFiles` can patch it - see
    // Design 1.3 / @nxext/common's wireTsSolutionProject. compilerOptions
    // mirror what @nxext/svelte passes for its own vite-based application
    // generator (application.ts).
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

  const lintTask = await addLinting(host, options);
  tasks.push(lintTask);
  const viteTask = await addVite(host, options);
  tasks.push(viteTask);
  createOrEditViteConfig(
    host,
    {
      project: options.projectName,
      includeLib: false,
      includeVitest: options.unitTestRunner === 'vitest',
      inSourceTests: false,
      rolldownOptionsExternal: [],
      imports: [`import { sveltekit } from '@sveltejs/kit/vite'`],
      plugins: [`sveltekit()`],
    },
    false,
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  if (!options.skipPackageJson) {
    const installTask = installDependencies(host, options);
    tasks.push(installTask);
  }

  return runTasksInSerial(...tasks);
}

export default applicationGenerator;
