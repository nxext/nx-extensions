import { AppType } from './../../utils/typings';
import { apply, applyTemplates, chain, mergeWith, move, Rule, Tree, url } from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  ProjectType,
  toFileName,
  updateWorkspace
} from '@nrwl/workspace';
import { names, offsetFromRoot } from '@nrwl/devkit';
import { ApplicationSchema } from './schema';
import { InitSchema } from '../init/schema';
import { addDefaultBuilders, calculateStyle } from '../../utils/utils';
import { appsDir } from '@nrwl/workspace/src/utils/ast-utils';
import init from '../init/init';
import { join } from 'path';
import { addStylePluginToConfigInTree } from '@nxext/stencil-compiler-utils';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

const projectType = ProjectType.Application;

function normalizeOptions(options: InitSchema, host: Tree): ApplicationSchema {
  const projectName = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${projectName}`
    : projectName;
  const projectRoot = `${appsDir(host)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);

  const appType = AppType.application;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    style,
    appType,
  };
}

function addFiles(options: ApplicationSchema): Rule {
  return mergeWith(
    apply(url(`./files/app`), [
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

export default function (options: InitSchema): Rule {
  return (host: Tree) => {
    const normalizedOptions = normalizeOptions(options, host);
    return chain([
      init(normalizedOptions),
      updateWorkspace((workspace) => {
        const targetCollection = workspace.projects.add({
          name: normalizedOptions.projectName,
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
          schematics: {
            '@nxext/stencil:component': {
              style: options.style,
              storybook: false,
            },
          },
        }).targets;
        addDefaultBuilders(targetCollection, projectType, normalizedOptions);
      }),
      addProjectToNxJsonInTree(normalizedOptions.projectName, {
        tags: normalizedOptions.parsedTags,
      }),
      addFiles(normalizedOptions),
      addStylePluginToConfigInTree(
        join(normalizedOptions.projectRoot, 'stencil.config.ts'),
        normalizedOptions.style
      ),
    ]);
  };
}

export const applicationGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'application'
);
