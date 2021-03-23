import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout, joinPathFragments,
  names,
  getWorkspacePath,
  offsetFromRoot,
  Tree
} from '@nrwl/devkit';
import * as path from 'path';
import { SveltekitGeneratorSchema } from './schema';
import { ProjectType } from '@nrwl/workspace';
import { relative } from 'path';

interface NormalizedSchema extends SveltekitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  distDir: string;
  parsedTags: string[];
}

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
  const distDir = relative(joinPathFragments(`${workspacePath}/${projectRoot}`), joinPathFragments(`${workspacePath}/dist/${projectRoot}`));

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

export default async function (host: Tree, options: SveltekitGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: ProjectType.Application,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          commands: ['svelte-kit build'],
          cwd: normalizedOptions.projectRoot,
          parallel: false
        }
      },
      serve: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          commands: ['svelte-kit dev'],
          cwd: normalizedOptions.projectRoot,
          parallel: false
        }
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(host, normalizedOptions);

  if(!normalizedOptions.skipFormat) {
    await formatFiles(host);
  }

  return addDependenciesToPackageJson(host, {}, {
    '@sveltejs/adapter-node': 'next',
    '@sveltejs/kit': 'next',
    'svelte': '^3.29.0',
    'vite': '^2.1.0',
    'svelte-preprocess': '^4.0.0'
  });
}
