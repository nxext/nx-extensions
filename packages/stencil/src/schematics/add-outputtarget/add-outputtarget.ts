import {
  chain,
  externalSchematic,
  noop,
  Rule,
  Tree,
} from '@angular-devkit/schematics';
import { Schema as ReactLibrarySchema } from '@nrwl/react/src/schematics/library/schema';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';
import * as ts from 'typescript';
import {
  addDepsToPackageJson,
  addGlobal,
  Change,
  findNodes,
  getProjectConfig,
  insert,
  InsertChange,
  insertImport,
} from '@nrwl/workspace/src/utils/ast-utils';
import { formatFiles, getNpmScope, toFileName } from '@nrwl/workspace';
import { addToGitignore, getLibsDir } from '../../utils/utils';
import {
  angularOutputTargetVersion,
  reactOutputTargetVersion,
} from '../../utils/versions';
import { addImportToModule } from '@nrwl/angular/src/utils/ast-utils';
import { getDistDir, getRelativePath } from '../../utils/fileutils';

type OutputTargetType = 'angular' | 'react';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: OutputTargetType;
  publishable: boolean;
}

export default function (options: AddOutputtargetSchematicSchema): Rule {
  return chain([
    options.outputType === 'react' ? prepareReactLibrary(options) : noop(),
    options.outputType === 'angular' ? prepareAngularLibrary(options) : noop(),
    addToOutputTargetToConfig(options.projectName, options.outputType),
    formatFiles(),
  ]);
}

function prepareReactLibrary(options: AddOutputtargetSchematicSchema) {
  const reactProjectName = `${options.projectName}-react`;
  return chain([
    externalSchematic('@nrwl/react', 'library', {
      name: reactProjectName,
      style: 'css',
      publishable: options.publishable,
    } as ReactLibrarySchema),
    addDepsToPackageJson(
      {},
      {
        '@stencil/react-output-target': reactOutputTargetVersion,
      }
    ),
    (tree) => {
      tree.delete(
        `${getLibsDir()}/${reactProjectName}/src/lib/${
          options.projectName
        }-react.tsx`
      );
      tree.delete(
        `${getLibsDir()}/${reactProjectName}/src/lib/${
          options.projectName
        }-react.spec.tsx`
      );
      tree.delete(
        `${getLibsDir()}/${reactProjectName}/src/lib/${
          options.projectName
        }-react.css`
      );

      tree.overwrite(
        `${getLibsDir()}/${reactProjectName}/src/index.ts`,
        `export * from './generated/components';`
      );
    },
    addToGitignore(`${getLibsDir()}/${reactProjectName}/**/generated`),
  ]);
}

function prepareAngularLibrary(options: AddOutputtargetSchematicSchema) {
  const angularProjectName = `${options.projectName}-angular`;
  return chain([
    externalSchematic('@nrwl/angular', 'library', {
      name: angularProjectName,
      style: 'css',
      skipPackageJson: !options.publishable,
    }),
    addDepsToPackageJson(
      {},
      {
        '@stencil/angular-output-target': angularOutputTargetVersion,
      }
    ),
    (tree: Tree) => {
      const angularModuleFilename = toFileName(angularProjectName);
      const angularModulePath = `${getLibsDir()}/${angularProjectName}/src/lib/${angularModuleFilename}.module.ts`;
      const angularModuleSource = readTsSourceFileFromTree(
        tree,
        angularModulePath
      );
      const packageName = `@${getNpmScope(tree)}/${options.projectName}`;

      /*insert(tree, angularModulePath, [
        insertImport(
          angularModuleSource,
          angularModulePath,
          'defineCustomElements',
          `${packageName}/loader`
        ),
        ...addGlobal(
          angularModuleSource,
          angularModulePath,
          'defineCustomElements(window);'
        ),
        ...addGlobal(
          angularModuleSource,
          angularModulePath,
          'const DECLARATIONS = [];'
        ),
        ...addImportToModule(
          angularModuleSource,
          angularModulePath,
          'DECLARATIONS'
        ),
      ]);*/
    },
    addToGitignore(`${getLibsDir()}/${angularProjectName}/**/generated`),
  ]);
}

function addToOutputTargetToConfig(
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
      const reactProjectConfig = getProjectConfig(tree, `${projectName}-react`);
      const realtivePath = getRelativePath(
        getDistDir(stencilProjectConfig.root),
        reactProjectConfig.root
      );

      insert(tree, stencilConfigPath, [
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'reactOutputTarget',
          '@stencil/react-output-target'
        ),
        ...addToOutputTargets(
          stencilConfigSource,
          `
          reactOutputTarget({
            componentCorePackage: '${packageName}',
            proxiesFile: '${realtivePath}/src/generated/components.ts',
          })
          `,
          stencilConfigPath
        ),
      ]);
    }

    if (outputType === 'angular') {
      const angularProjectConfig = getProjectConfig(
        tree,
        `${projectName}-angular`
      );
      const realtivePath = getRelativePath(
        getDistDir(stencilProjectConfig.root),
        angularProjectConfig.root
      );

      insert(tree, stencilConfigPath, [
        insertImport(
          stencilConfigSource,
          stencilConfigPath,
          'angularOutputTarget',
          '@stencil/angular-output-target'
        ),
        ...addGlobal(
          stencilConfigSource,
          stencilConfigPath,
          'const angularValueAccessorBindings = [];'
        ),
        ...addToOutputTargets(
          stencilConfigSource,
          `
          angularOutputTarget({
              componentCorePackage: '${packageName}',
              directivesProxyFile: '${realtivePath}/src/generated/directives/proxies.ts',
              valueAccessorConfigs: angularValueAccessorBindings
            }),
          `,
          stencilConfigPath
        ),
      ]);
    }

    return tree;
  };
}

function addToOutputTargets(
  source: ts.SourceFile,
  toInsert: string,
  file: string
): Change[] {
  const outputTargetsIdentifier = 'outputTargets';
  const nodes = findNodes(source, ts.SyntaxKind.ObjectLiteralExpression);
  let node = nodes[0];
  const matchingProperties: ts.ObjectLiteralElement[] = (node as ts.ObjectLiteralExpression).properties
    .filter((prop) => prop.kind == ts.SyntaxKind.PropertyAssignment)
    .filter((prop: ts.PropertyAssignment) => {
      if (prop.name.kind === ts.SyntaxKind.Identifier) {
        return (
          (prop.name as ts.Identifier).getText(source) ==
          outputTargetsIdentifier
        );
      }

      return false;
    });

  if (!matchingProperties) {
    return [];
  }

  if (matchingProperties.length == 0) {
    // We haven't found the field in the metadata declaration. Insert a new field.
    const expr = node as ts.ObjectLiteralExpression;
    let position: number;
    let toInsert2: string;
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert2 = `  ${outputTargetsIdentifier}: [${toInsert}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match('^\r?\r?\n')) {
        toInsert2 = `,${
          text.match(/^\r?\n\s+/)[0]
        }${outputTargetsIdentifier}: [${toInsert}]`;
      } else {
        toInsert2 = `, ${outputTargetsIdentifier}: [${toInsert}]`;
      }
    }
    const newMetadataProperty = new InsertChange(file, position, toInsert2);
    return [newMetadataProperty];
  }

  const assignment = matchingProperties[0] as ts.PropertyAssignment;
  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return [];
  }

  const lastItem = getLastEntryOfOutputtargetArray(assignment);

  let toInsert2 = `, ${toInsert}`;
  if (lastItem.getText() === ',') {
    toInsert2 = toInsert;
  }

  return [new InsertChange(file, lastItem.getEnd(), toInsert2)];
}

function getLastEntryOfOutputtargetArray(node: ts.Node) {
  const arrayEntryList = node.getChildren()[2].getChildren()[1].getChildren();
  return arrayEntryList
    .sort(
      (first: ts.Node, second: ts.Node) => first.getStart() - second.getStart()
    )
    .pop();
}
