import { apply, applyTemplates, chain, mergeWith, move, Rule, url } from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace
} from '@nrwl/workspace';
import { PWASchema } from './schema';
import core from '../core/core';
import { CoreSchema } from '../core/schema';
import { AppType } from '../../utils/typings';
import { calculateStyle } from '../../utils/functions';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
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

export default function (options: CoreSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    core(normalizedOptions),
    updateWorkspace((workspace) => {
      workspace.projects
        .add({
          name: normalizedOptions.projectName,
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
        })
        .targets.add({
          name: 'build',
          builder: '@nxext/stencil:build',
          options: {
            projectType,
          },
        });
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions)
  ]);
}
