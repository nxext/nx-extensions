import { AppType } from './../../utils/typings';
import { apply, applyTemplates, chain, mergeWith, move, Rule, Tree, url } from '@angular-devkit/schematics';
import { addProjectToNxJsonInTree, formatFiles, ProjectType, updateWorkspace } from '@nrwl/workspace';
import { names, offsetFromRoot } from '@nrwl/devkit';
import { ApplicationSchema } from './schema';
import { InitSchema } from '../init/schema';
import { addDefaultBuilders, calculateStyle } from '../../utils/utils';
import { initSchematic } from '../init/init';
import { join } from 'path';
import { addStylePluginToConfigInTree } from '../../stencil-core-utils';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { appsDir } from '@nrwl/workspace/src/utils/ast-utils';

const projectType = ProjectType.Application;

function normalizeOptions(options: InitSchema, host: Tree): ApplicationSchema {
  const projectName = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${projectName}`
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
        offsetFromRoot: offsetFromRoot(options.projectRoot)
      }),
      move(options.projectRoot),
      formatFiles({ skipFormat: false })
    ])
  );
}

export function applicationSchematic(options: InitSchema): Rule {
  return (host: Tree) => {
    const normalizedOptions = normalizeOptions(options, host);
    return chain([
      initSchematic(normalizedOptions),
      updateWorkspace((workspace) => {
        const targetCollection = workspace.projects.add({
          name: normalizedOptions.projectName,
          root: normalizedOptions.projectRoot,
          sourceRoot: `${normalizedOptions.projectRoot}/src`,
          projectType,
          schematics: {
            '@nxext/stencil:component': {
              style: options.style,
              storybook: false
            }
          }
        }).targets;
        addDefaultBuilders(targetCollection, projectType, normalizedOptions);
      }),
      addProjectToNxJsonInTree(normalizedOptions.projectName, {
        tags: normalizedOptions.parsedTags
      }),
      addFiles(normalizedOptions),
      addStylePluginToConfigInTree(
        join(normalizedOptions.projectRoot, 'stencil.config.ts'),
        normalizedOptions.style
      )
    ]);
  };
}

export default applicationSchematic;
export const applicationGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'application'
);
