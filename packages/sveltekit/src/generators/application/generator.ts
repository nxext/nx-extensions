import {
  addProjectConfiguration,
  formatFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
  runTasksInSerial,
  workspaceRoot,
} from '@nx/devkit';
import { NormalizedSchema, SveltekitGeneratorSchema } from './schema';
import { ProjectType } from '@nx/workspace';
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

  const config = {
    ...options,
    distDir,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };

  return config;
}

export async function applicationGenerator(
  host: Tree,
  schema: SveltekitGeneratorSchema
) {
  try {
    const options = normalizeOptions(host, schema);
    // const optStr = JSON.stringify(options, null, 2);
    // throw new Error(optStr);
    const targets = {
      check: createSvelteCheckTarget(options),
      add: {
        executor: '@nxext/sveltekit:add',
      },
    };

    addProjectConfiguration(host, options.projectName, {
      root: options.projectRoot,
      projectType: ProjectType.Application,
      sourceRoot: `${options.projectRoot}/src`,
      targets: targets,
      tags: options.parsedTags,
    });
    addFiles(host, options);

    const lintTask = await addLinting(host, options);
    const viteTask = await addVite(host, options);

    updateViteConfig(host, options);

    if (!options.skipFormat) {
      await formatFiles(host);
    }

    const installTask = installDependencies(host);

    return runTasksInSerial(installTask, viteTask, lintTask);
  } catch (e) {
    throw new Error(e);
  }
}

export default applicationGenerator;
