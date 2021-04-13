import { Rule, Tree } from '@angular-devkit/schematics';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { readTsSourceFileFromTree } from '../../../utils/ast-utils';
import { getNpmScope } from '@nrwl/workspace';
import { addReactOutputtarget } from './react';
import { addVueOutputtarget } from './vue';
import { addAngularOutputtarget } from './angular';
import * as ts from 'typescript';

export type OutputTargetType = 'angular' | 'react' | 'vue' | 'svelte';

export function addToOutputTargetToConfig(
  projectName: string,
  outputType: OutputTargetType
): Rule {
  return (tree: Tree) => {
    const stencilProjectConfig = getProjectConfig(tree, projectName);

    const stencilConfigPath = `${stencilProjectConfig.root}/stencil.config.ts`;
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
