import * as ts from 'typescript';
import { ChangeType, StringChange, Tree } from '@nrwl/devkit';
import { findNodes } from 'nx/src/utils/typescript';
import { insertChange } from '@nrwl/workspace/src/utilities/ast-utils';
import { tsquery } from '@phenomnomnominal/tsquery';

export function readTsSourceFile(host: Tree, path: string): ts.SourceFile {
  if (!host.exists(path)) {
    throw new Error(`Typescript file not readable (${path}).`);
  } else {
    const contentBuffer = host.read(path);
    return tsquery.ast(contentBuffer.toString());
  }
}

export function addImport(
  source: ts.SourceFile,
  statement: string
): StringChange[] {
  return [addAfterLastImport(source, statement)];
}

export function addAfterLastImport(
  source: ts.SourceFile,
  statement: string
): StringChange {
  const allImports = tsquery(source, 'ImportDeclaration');
  if (allImports.length > 0) {
    const lastImport = allImports[allImports.length - 1];
    return {
      type: ChangeType.Insert,
      index: lastImport.end + 1,
      text: `\n${statement}\n`,
    };
  } else {
    return {
      type: ChangeType.Insert,
      index: 0,
      text: `\n${statement}\n`,
    };
  }
}

export function insertImport(
  host: Tree,
  source: ts.SourceFile,
  fileToEdit: string,
  symbolName: string,
  fileName: string,
  isDefault = false
): ts.SourceFile {
  const rootNode = source;
  const allImports = tsquery(source, 'ImportDeclaration');

  // get nodes that map to import statements from the file fileName
  const relevantImports = allImports.filter((node) => {
    // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
    const importFiles = node
      .getChildren()
      .filter((child) => child.kind === ts.SyntaxKind.StringLiteral)
      .map((n) => (n as ts.StringLiteral).text);

    return importFiles.filter((file) => file === fileName).length === 1;
  });

  if (relevantImports.length > 0) {
    let importsAsterisk = false;
    // imports from import file
    const imports: ts.Node[] = [];
    relevantImports.forEach((n) => {
      Array.prototype.push.apply(
        imports,
        findNodes(n, ts.SyntaxKind.Identifier)
      );
      if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
        importsAsterisk = true;
      }
    });

    // if imports * from fileName, don't add symbolName
    if (importsAsterisk) {
      return source;
    }

    const importTextNodes = imports.filter(
      (n) => (n as ts.Identifier).text === symbolName
    );

    // insert import if it's not there
    if (importTextNodes.length === 0) {
      const fallbackPos =
        findNodes(
          relevantImports[0],
          ts.SyntaxKind.CloseBraceToken
        )[0].getStart() ||
        findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

      return insertAfterLastOccurrence(
        host,
        source,
        imports,
        `, ${symbolName}`,
        fileToEdit,
        fallbackPos
      );
    }

    return source;
  }

  // no such import declaration exists
  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral).filter(
    (n: ts.StringLiteral) => n.text === 'use strict'
  );
  let fallbackPos = 0;
  if (useStrict.length > 0) {
    fallbackPos = useStrict[0].end;
  }
  const open = isDefault ? '' : '{ ';
  const close = isDefault ? '' : ' }';
  // if there are no imports or 'use strict' statement, insert import at beginning of file
  const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
  const separator = insertAtBeginning ? '' : ';\n';
  const toInsert =
    `${separator}import ${open}${symbolName}${close}` +
    ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;

  return insertAfterLastOccurrence(
    host,
    source,
    allImports,
    toInsert,
    fileToEdit,
    fallbackPos,
    ts.SyntaxKind.StringLiteral
  );
}

function insertAfterLastOccurrence(
  host: Tree,
  sourceFile: ts.SourceFile,
  nodes: ts.Node[],
  toInsert: string,
  pathToFile: string,
  fallbackPos: number,
  syntaxKind?: ts.SyntaxKind
): ts.SourceFile {
  // sort() has a side effect, so make a copy so that we won't overwrite the parent's object.
  let lastItem = [...nodes].sort(nodesByPosition).pop();
  if (!lastItem) {
    throw new Error();
  }
  if (syntaxKind) {
    lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
  }
  if (!lastItem && fallbackPos == undefined) {
    throw new Error(
      `tried to insert ${toInsert} as first occurrence with no fallback position`
    );
  }
  const lastItemPosition: number = lastItem ? lastItem.getEnd() : fallbackPos;

  return insertChange(host, sourceFile, pathToFile, lastItemPosition, toInsert);
}

function nodesByPosition(first: ts.Node, second: ts.Node): number {
  return first.getStart() - second.getStart();
}
