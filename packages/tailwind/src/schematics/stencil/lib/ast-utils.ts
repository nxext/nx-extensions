import {
  applyChangesToString,
  ChangeType,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
  StringChange,
  Tree
} from '@nrwl/devkit';
import * as ts from 'typescript';
import { findNodes } from '@nrwl/workspace/src/utils/ast-utils';
import { Schema } from '../schematic';

export function readTsSourceFile(host: Tree, path: string): ts.SourceFile {
  if (!host.exists(path)) {
    throw new Error(`Typescript file not readable (${path}).`);
  } else {
    const contentBuffer = host.read(path);
    return ts.createSourceFile(
      path,
      contentBuffer.toString(),
      ts.ScriptTarget.Latest,
      true
    );
  }
}

export function addImport(
  source: ts.SourceFile,
  statement: string
): StringChange {
  return addAfterLastImport(source, statement);
}

function addAfterLastImport(
  source: ts.SourceFile,
  statement: string
): StringChange {
  const allImports = findNodes(source, ts.SyntaxKind.ImportDeclaration);
  if (allImports.length > 0) {
    const lastImport = allImports[allImports.length - 1];
    return ({
      type: ChangeType.Insert,
      index: lastImport.end + 1,
      text: `\n${statement}\n`
    });
  } else {
    return ({
      type: ChangeType.Insert,
      index: 0,
      text: `\n${statement}\n`
    });
  }
}

function addCodeIntoArray(
  source: ts.SourceFile,
  identifier: string,
  toInsert: string
): StringChange[] {
  const nodes = findNodes(source, ts.SyntaxKind.ObjectLiteralExpression);
  let node = nodes[0];
  const matchingProperties: ts.ObjectLiteralElement[] = (node as ts.ObjectLiteralExpression).properties
    .filter((prop) => prop.kind == ts.SyntaxKind.PropertyAssignment)
    .filter((prop: ts.PropertyAssignment) => {
      if (prop.name.kind === ts.SyntaxKind.Identifier) {
        return (prop.name as ts.Identifier).getText(source) == identifier;
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
      toInsert2 = `  ${identifier}: [${toInsert}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match('^\r?\r?\n')) {
        toInsert2 = `,${
          text.match(/^\r?\n\s+/)[0]
        }${identifier}: [${toInsert}]`;
      } else {
        toInsert2 = `, ${identifier}: [${toInsert}]`;
      }
    }
    return [
      {
        type: ChangeType.Insert,
        index: position,
        text: `\n${toInsert2}\n`
      }
    ];
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

  return [
    {
      type: ChangeType.Insert,
      index: lastItem.getEnd(),
      text: `\n${toInsert2}\n`
    }
  ];
}

function getLastEntryOfOutputtargetArray(node: ts.Node) {
  const arrayEntryList = node.getChildren()[2].getChildren()[1].getChildren();
  return arrayEntryList
    .sort(
      (first: ts.Node, second: ts.Node) => first.getStart() - second.getStart()
    )
    .pop();
}


export function addToPlugins(
  source: ts.SourceFile,
  toInsert: string
): StringChange[] {
  const pluginsIdentifier = 'plugins';
  return addCodeIntoArray(source, pluginsIdentifier, toInsert);
}

export function addStylePluginToConfigInTree(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;
  const stencilConfigPath =
    projectConfig?.targets?.build?.options?.configPath ||
    projectConfig?.targets?.test?.options?.configPath;
  const stencilConfigSource = readTsSourceFile(tree, stencilConfigPath);


  const changes = applyChangesToString(stencilConfigSource.text,
    [
      addImport(stencilConfigSource, `import { postcss } from '@stencil/postcss'`),
      addImport(stencilConfigSource, `import autoprefixer from 'autoprefixer'`),
      addImport(stencilConfigSource, `import cssnano from 'cssnano'`),
      addImport(stencilConfigSource, `import tailwindcss from 'tailwindcss'`),
      ...addToPlugins(stencilConfigSource, `
        postcss({
          plugins: [
            tailwindcss('./${projectRoot}/tailwind.config.js'),
            autoprefixer(),
            cssnano()
          ]
        })
      `)
    ]
  );

  tree.write(stencilConfigPath, changes);
}
