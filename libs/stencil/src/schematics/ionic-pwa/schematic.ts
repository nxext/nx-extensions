import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace,
} from '@nrwl/workspace';
import { PWASchema } from './schema';
import { CoreSchema } from '../core/schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/functions';
import core, { addBuilderToTarget } from '../core/core';

const projectType = ProjectType.Application;

function normalizeOptions(options: CoreSchema): PWASchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.Pwa;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
  } as PWASchema;
}

function addFiles(options: PWASchema): Rule {
  return mergeWith(
    apply(url(`./files/pwa`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
      formatFiles({ skipFormat: false }),
    ])
  );
}

function changeStencilConfig(options: PWASchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    //const content: Buffer | null = tree.read("apps/pwa/src/stencil.config.ts");
    //_context.logger.info(content.toString());
  };
}

export default function (options: CoreSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    core(normalizedOptions),
    updateWorkspace((workspace) => {
      const targetCollection = workspace.projects.add({
        name: normalizedOptions.projectName,
        root: normalizedOptions.projectRoot,
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        projectType,
      }).targets;
      addBuilderToTarget(
        targetCollection,
        'build',
        projectType,
        normalizedOptions
      );
      addBuilderToTarget(
        targetCollection,
        'test',
        projectType,
        normalizedOptions
      );
      addBuilderToTarget(
        targetCollection,
        'e2e',
        projectType,
        normalizedOptions
      );
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions),
  ]);
}
