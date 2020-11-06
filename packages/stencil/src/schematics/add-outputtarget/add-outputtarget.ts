import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';
import * as ts from 'typescript';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { formatFiles, getNpmScope } from '@nrwl/workspace';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { addVueOutputtarget, prepareVueLibrary } from './lib/vue';
import { addReactOutputtarget, prepareReactLibrary } from './lib/react';
import { addAngularOutputtarget, prepareAngularLibrary } from './lib/angular';

type OutputTargetType = 'angular' | 'react' | 'vue';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: OutputTargetType;
  publishable: boolean;
}

export default function (options: AddOutputtargetSchematicSchema): Rule {
  return chain([
    options.outputType === 'react' ? prepareReactLibrary(options) : noop(),
    options.outputType === 'angular' ? prepareAngularLibrary(options) : noop(),
    options.outputType === 'vue' ? prepareVueLibrary(options) : noop(),
    addToOutputTargetToConfig(options.projectName, options.outputType),
    formatFiles(),
  ]);
}

function addToOutputTargetToConfig(
  projectName: string,
  outputType: OutputTargetType
): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const stencilProjectConfig = getProjectConfig(tree, projectName);

    const stencilConfigPath = `${stencilProjectConfig.root}/stencil.config.ts`;


    if(tree.exists(stencilConfigPath)) {
      context.logger.info(stripIndents`
        Please use a buildable library for custom outputtargets
      `)
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
