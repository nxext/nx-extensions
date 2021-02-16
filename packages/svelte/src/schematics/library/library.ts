import {
  chain,
  Rule,
} from '@angular-devkit/schematics';
import {
  addLintFiles,
  addProjectToNxJsonInTree,
  formatFiles,
  projectRootDir,
  ProjectType,
  toFileName,
} from '@nrwl/workspace';
import { NormalizedSchema, SvelteSchematicSchema } from './schema';
import { extraEslintDependencies, svelteEslintJson } from '../utils/lint';
import init from '../init/init';
import { handleJest, addFiles } from './lib';
import { addProject } from './lib/add-project';

function normalizeOptions(options: SvelteSchematicSchema): NormalizedSchema {
  const name = toFileName(options.name);
  const projectName = name.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(ProjectType.Library)}/${name}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    parsedTags,
    skipFormat: false,
  };
}

export default function (options: SvelteSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    init({ ...normalizedOptions, skipFormat: true }),
    addProject(normalizedOptions),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions),
    addLintFiles(normalizedOptions.projectRoot, options.linter, {
      localConfig: svelteEslintJson,
      extraPackageDeps: extraEslintDependencies,
    }),
    handleJest(normalizedOptions),
    formatFiles(normalizedOptions),
  ]);
}
