import { apply, applyTemplates, chain, mergeWith, move, Rule, Tree, url } from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  names,
  offsetFromRoot,
  ProjectType,
  toFileName,
  updateWorkspace
} from '@nrwl/workspace';
import { PWASchema } from './schema';
import { InitSchema } from '../init/schema';
import { AppType } from '../../utils/typings';
import { addDefaultBuilders, calculateStyle } from '../../utils/utils';
import { appsDir } from '@nrwl/workspace/src/utils/ast-utils';
import init from '../init/init';
import { join } from 'path';
import { addStylePluginToConfigInTree } from '../../stencil-core-utils';

const projectType = ProjectType.Application;

function normalizeOptions(options: InitSchema, host: Tree): PWASchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${appsDir(host)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const style = calculateStyle(options.style);
  const appType = AppType.pwa;

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
