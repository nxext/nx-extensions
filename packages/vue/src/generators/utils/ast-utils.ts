import * as ts from 'typescript';
import { findNodes } from 'nx/src/utils/typescript';
import { ChangeType, StringChange } from '@nx/devkit';

/*
 * Original code from https://github.com/nrwl/nx/blob/master/packages/react/src/utils/ast-utils.ts
 */

export function addImport(
  source: ts.SourceFile,
  statement: string
): StringChange[] {
  const allImports = findNodes(source, ts.SyntaxKind.ImportDeclaration);
  if (allImports.length > 0) {
    const lastImport = allImports[allImports.length - 1];
    return [
      {
        type: ChangeType.Insert,
        index: lastImport.end + 1,
        text: `\n${statement}\n`,
      },
    ];
  } else {
    return [
      {
        type: ChangeType.Insert,
        index: 0,
        text: `\n${statement}\n`,
      },
    ];
  }
}
