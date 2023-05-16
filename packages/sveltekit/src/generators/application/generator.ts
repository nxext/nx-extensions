import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  getWorkspacePath,
  offsetFromRoot,
  Tree,
  convertNxGenerator,
  runTasksInSerial,
} from '@nx/devkit';
import * as path from 'path';
import { NormalizedSchema, SveltekitGeneratorSchema } from './schema';
import { ProjectType } from '@nx/workspace';
import { relative } from 'path';
import { addLinting } from './lib/add-linting';
import { installDependencies } from './lib/install-dependencies';
import { viteInitGenerator } from '@nxext/vite';
import { createViteTargets } from './lib/targets';

function normalizeOptions(
  host: Tree,
  options: SveltekitGeneratorSchema
): NormalizedSchema {
  const workspacePath = getWorkspacePath(host);
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
    joinPathFragments(`${workspacePath}/${projectRoot}`),
    joinPathFragments(`${workspacePath}/dist/${projectRoot}`)
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

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export async function applicationGenerator(
  host: Tree,
  schema: SveltekitGeneratorSchema
) {
  const options = normalizeOptions(host, schema);

  const targets = {
    ...createViteTargets(options),
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

  const viteTask = await viteInitGenerator(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  const installTask = installDependencies(host);

  return runTasksInSerial(installTask, lintTask, viteTask);
}

export default applicationGenerator;
