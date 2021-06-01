import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { chain, noop, Rule, Tree } from '@angular-devkit/schematics';
import { logger } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { formatFiles, getWorkspacePath, readJsonInTree } from '@nrwl/workspace';

import { SupportedStyles } from '../../stencil-core-utils';
import { addToOutputTargetToConfig, OutputTargetType } from './lib/add-outputtarget-to-config';
import { prepareAngularLibrary } from './lib/angular';
import { prepareReactLibrary } from './lib/react';
import { prepareVueLibrary } from './lib/vue';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: OutputTargetType;
  publishable: boolean;
  importPath?: string;
  style?: SupportedStyles;
}

export function isStencilProjectBuilder(
  project: any,
  builderCommand: string
): boolean {
  const buildArchitect =
    project.architect && project.architect[builderCommand]
      ? project.architect[builderCommand]
      : {};
  return (
    buildArchitect &&
    buildArchitect.builder === `@nxext/stencil:${builderCommand}`
  );
}

function checkBuildable(options: AddOutputtargetSchematicSchema): Rule {
  return (tree: Tree) => {
    const workspaceJson = readJsonInTree(tree, getWorkspacePath(tree));
    const project = workspaceJson.projects[options.projectName];

    if (isStencilProjectBuilder(project, 'build')) {
      return chain([
        options.outputType === 'react' ? prepareReactLibrary(options) : noop(),
        options.outputType === 'angular'
          ? prepareAngularLibrary(options)
          : noop(),
        options.outputType === 'vue' ? prepareVueLibrary(options) : noop(),
        addToOutputTargetToConfig(options.projectName, options.outputType),
        formatFiles(),
      ]);
    } else {
      logger.info(stripIndents`
          Please use a buildable library for custom outputtargets

          You could make this library buildable with:

          nx generate @nxext/stencil:make-lib-buildable ${options.projectName}
          or
          ng generate @nxext/stencil:make-lib-buildable ${options.projectName}
        `);
      return noop();
    }
  };
}

export function outputtargetSchematic(options: AddOutputtargetSchematicSchema): Rule {
  return checkBuildable(options);
}

export default outputtargetSchematic;
export const outputtargetGenerator = wrapAngularDevkitSchematic(
  '@nxext/stencil',
  'add-outputtarget'
);
