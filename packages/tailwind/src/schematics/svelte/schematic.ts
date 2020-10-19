import {
  applyTemplates,
  chain,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { addDepsToPackageJson, getProjectConfig } from '@nrwl/workspace';
import { applyWithSkipExisting } from '../../utils/utils';
import { join, normalize } from '@angular-devkit/core';

export interface Schema {
  project: string;
}

function createTailwindConfigForProject(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const projectConfig = getProjectConfig(tree, options.project);
    const sourceRoot = projectConfig.sourceRoot;
    const projectRoot = projectConfig.root;

    return chain([
      applyWithSkipExisting(url('./files'), [
        applyTemplates({
          sourceRoot
        }),
        move(projectRoot)
      ])
    ])(tree, context);
  };
}

export default function(options: Schema): Rule {
  return chain([
    addDepsToPackageJson({}, {
      'tailwindcss': '^1.9.0'
    }),
    createTailwindConfigForProject(options)
  ]);
}
