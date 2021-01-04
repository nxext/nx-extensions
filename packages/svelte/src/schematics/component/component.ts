import {
  applyTemplates,
  chain,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { getProjectConfig, toClassName, toFileName } from '@nrwl/workspace';
import { join, normalize } from '@angular-devkit/core';
import { applyWithSkipExisting } from '../utils/utils';
import { names } from '@nrwl/devkit';

export interface ComponentSchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}

function createComponentInProject(options: ComponentSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const projectConfig = getProjectConfig(tree, options.project);

    const projectDirectory = options.directory
      ? join(normalize(options.directory))
      : join(normalize(''));

    return chain([
      applyWithSkipExisting(url('./files/src'), [
        applyTemplates(names(options.name)),
        move(join(normalize(projectConfig.sourceRoot), projectDirectory)),
      ]),
    ])(tree, context);
  };
}

export default function (options: ComponentSchema): Rule {
  return chain([createComponentInProject(options)]);
}
