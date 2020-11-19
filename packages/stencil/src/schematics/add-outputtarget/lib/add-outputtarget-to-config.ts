import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { readTsSourceFileFromTree } from '../../../utils/ast-utils';
import { getNpmScope } from '@nrwl/workspace';
import { addReactOutputtarget } from './react';
import { addVueOutputtarget } from './vue';
import { addAngularOutputtarget } from './angular';
import * as ts from 'typescript';

export type OutputTargetType = 'angular' | 'react' | 'vue';

export function addToOutputTargetToConfig(
  projectName: string,
  outputType: OutputTargetType
): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const stencilProjectConfig = getProjectConfig(tree, projectName);

    const stencilConfigPath = `${stencilProjectConfig.root}/stencil.config.ts`;

    if (tree.exists(stencilConfigPath)) {
      context.logger.info(stripIndents`
        Please use a buildable library for custom outputtargets
      `);
    }

    const stencilConfigSource: ts.SourceFile = readTsSourceFileFromTree(
      tree,
      stencilConfigPath
    );

    const packageName = `@${getNpmScope(tree)}/${projectName}`;

    if (outputType === 'react') {
      addReactOutputtarget(
        tree,
        projectName,
        stencilProjectConfig,
        stencilConfigPath,
        stencilConfigSource,
        packageName
      );
    }

    if (outputType === 'vue') {
      addVueOutputtarget(
        tree,
        projectName,
        stencilProjectConfig,
        stencilConfigPath,
        stencilConfigSource,
        packageName
      );
    }

    if (outputType === 'angular') {
      addAngularOutputtarget(
        tree,
        projectName,
        stencilProjectConfig,
        stencilConfigPath,
        stencilConfigSource,
        packageName
      );
    }

    return tree;
  };
}
