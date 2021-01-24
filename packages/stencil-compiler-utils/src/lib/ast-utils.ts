import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export function readTsSourceFileFromTree(
  host: Tree,
  path: string
): ts.SourceFile {
  const contentBuffer = host.read(path);
  if (!contentBuffer) {
    throw new SchematicsException(`Typescript file not readable (${path}).`);
  }

  return ts.createSourceFile(
    path,
    contentBuffer.toString(),
    ts.ScriptTarget.Latest,
    true
  );
}
