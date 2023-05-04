import * as ts from 'typescript';
import { ChangeType, StringChange, Tree } from '@nx/devkit';
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
