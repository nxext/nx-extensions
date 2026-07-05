import {
  addProjectConfiguration,
  formatFiles,
  Tree,
  runTasksInSerial,
  GeneratorCallback,
} from '@nx/devkit';
import { SveltekitGeneratorSchema } from './schema';
import { addLinting } from './lib/add-linting';
import { installDependencies } from './lib/install-dependencies';
import { addFiles } from './lib/add-project-files';
import { createSvelteCheckTarget } from './lib/targets';
import { addVite } from './lib/add-vite';
import { normalizeOptions } from './lib/normalize-options';
import { createOrEditViteConfig } from '@nx/vite';
import { assertNotUsingTsSolutionSetup } from '@nx/js/internal';

export async function applicationGenerator(
  host: Tree,
  schema: SveltekitGeneratorSchema
) {
  assertNotUsingTsSolutionSetup(host, '@nxext/sveltekit', 'application');

  const tasks: GeneratorCallback[] = [];
  const options = await normalizeOptions(host, schema);

  const targets = {
    check: createSvelteCheckTarget(options),
    add: {
      executor: '@nxext/sveltekit:add',
    },
  };

  addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    targets: targets,
    tags: options.parsedTags,
  });
  addFiles(host, options);

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
    false
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
