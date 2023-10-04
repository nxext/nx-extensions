import {
  addProjectConfiguration,
  formatFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
  runTasksInSerial,
  workspaceRoot,
  GeneratorCallback,
} from '@nx/devkit';
import { NormalizedSchema, SveltekitGeneratorSchema } from './schema';
import { relative } from 'path';
import { addLinting } from './lib/add-linting';
import { installDependencies } from './lib/install-dependencies';
import { addFiles } from './lib/add-project-files';
import { createSvelteCheckTarget } from './lib/targets';
import { addVite } from './lib/add-vite';
import { updateViteConfig } from './lib/update-vite-config';

function normalizeOptions(
  host: Tree,
  options: SveltekitGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const distDir = relative(
    joinPathFragments(`${workspaceRoot}/${projectRoot}`),
    joinPathFragments(`${workspaceRoot}/dist/${projectRoot}`)
  );

  return {
    ...options,
    distDir,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

export async function applicationGenerator(
  host: Tree,
  schema: SveltekitGeneratorSchema
) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(host, schema);

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

  updateViteConfig(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  if (!options.skipPackageJson) {
    const installTask = installDependencies(host);
    tasks.push(installTask);
  }

  return runTasksInSerial(...tasks);
}

export default applicationGenerator;
