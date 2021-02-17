import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';
import {
  addLintFiles,
  addProjectToNxJsonInTree,
  formatFiles,
  projectRootDir,
  ProjectType,
  toFileName,
} from '@nrwl/workspace';
import { names, offsetFromRoot } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { NormalizedSchema, SvelteApplicationSchema } from './schema';
import { extraEslintDependencies, svelteEslintJson } from '../utils/lint';
import { addCypress } from './lib/add-cypress';
import { addProject } from './lib/add-project';
import { handleJest } from './lib/handle-jest';
import init from '../init/init';

function normalizeOptions(options: SvelteApplicationSchema): NormalizedSchema {
  const name = toFileName(options.name);
  const projectName = name.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(ProjectType.Application)}/${name}`;
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

function addFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        projectRoot: options.projectRoot,
      }),
      move(options.projectRoot),
    ])
  );
}

export default function (options: SvelteApplicationSchema): Rule {
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
    addCypress(normalizedOptions),
    formatFiles(normalizedOptions),
  ]);
}

export const applicationGenerator = wrapAngularDevkitSchematic(
  '@nxext/svelte',
  'application'
);
