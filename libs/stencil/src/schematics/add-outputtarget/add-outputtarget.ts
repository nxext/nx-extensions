import {
  chain,
  externalSchematic,
  noop,
  Rule,
} from '@angular-devkit/schematics';
import { Schema as ReactLibrarySchema } from '@nrwl/react/src/schematics/library/schema';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';
import * as ts from 'typescript';
import { insert, insertImport } from '@nrwl/workspace/src/utils/ast-utils';

type outputTargetType = 'angular' | 'react';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: outputTargetType;
}

export default function (options: AddOutputtargetSchematicSchema): Rule {
  return chain([
    options.outputType === 'react' ? prepareReactApp(options) : noop(),
    options.outputType === 'angular' ? prepareAngularApp(options) : noop(),
  ]);
}

function prepareReactApp(options: AddOutputtargetSchematicSchema) {
  return chain([
    externalSchematic('@nrwl/react', 'library', {
      name: `${options.projectName}-react`,
      style: 'css',
      publishable: false,
    } as ReactLibrarySchema),
    (tree) => {
      tree.delete(
        `libs/${options.projectName}-react/src/lib/${options.projectName}-react.tsx`
      );
      tree.delete(
        `libs/${options.projectName}-react/src/lib/${options.projectName}-react.spec.tsx`
      );
      tree.delete(
        `libs/${options.projectName}-react/src/lib/${options.projectName}-react.css`
      );

      tree.overwrite(
        `libs/${options.projectName}-react/src/index.ts`,
        `export * from './generated/components';`
      );
    },
    updateStencilConfig(options.projectName),
  ]);
}

function prepareAngularApp(options: AddOutputtargetSchematicSchema) {
  return chain([
    externalSchematic('@nrwl/angular', 'library', {
      name: `${options.projectName}-angular`,
      style: 'css',
      publishable: false,
    }),
    (tree) => {},
  ]);
}

function updateStencilConfig(projectName: string): Rule {
  return (tree, context) => {
    const stencilConfigPath = `libs/${projectName}/stencil.config.ts`;
    const stencilConfigSource: ts.SourceFile = readTsSourceFileFromTree(
      tree,
      stencilConfigPath
    );

    insert(tree, stencilConfigPath, [
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'reactOutputTarget',
        '@stencil/react-output-target'
      ),
    ]);

    return tree;
  };
}
