import * as ts from 'typescript';

import { PreactComponentSchema } from '../component';
import {
  applyChangesToString,
  ChangeType,
  joinPathFragments,
  names,
  readProjectConfiguration,
  StringChange,
  Tree,
} from '@nx/devkit';
import { findNodes } from '@nx/js';
import { getProjectSourceRoot, getProjectType } from '@nx/js/internal';

export function addExportsToBarrel(tree: Tree, options: PreactComponentSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  const { className, fileName } = names(options.name);
  // package.json-backed (TS-solution) projects don't carry an explicit
  // `sourceRoot` - getProjectSourceRoot falls back to `<root>/src` for them.
  const indexFilePath = joinPathFragments(
    getProjectSourceRoot(projectConfig, tree),
    'index.ts',
  );
  const componentFile = `./components/${fileName}/${className}.ts`;

  // package.json-backed (TS-solution) projects don't carry an explicit
  // `projectType` unless nx.json configures a workspaceLayout -
  // getProjectType falls back to tsconfig.lib.json/tsconfig.app.json
  // existence, and returns the explicit value unchanged for legacy
  // project.json projects.
  if (
    getProjectType(tree, projectConfig.root, projectConfig.projectType) ===
    'library'
  ) {
    const { content, source } = readSourceFile(tree, indexFilePath);

    const changes = applyChangesToString(
      content,
      addExport(
        source,
        `export { default as ${className} } from '${componentFile}';`,
      ),
    );
    tree.write(indexFilePath, changes);
  }
}

export function addExport(
  source: ts.SourceFile,
  statement: string,
): StringChange[] {
  const allExports = findNodes(source, ts.SyntaxKind.ExportDeclaration);
  if (allExports.length > 0) {
    const lastImport = allExports[allExports.length - 1];
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

function readSourceFile(
  host: Tree,
  path: string,
): { content: string; source: ts.SourceFile } {
  if (!host.exists(path)) {
    throw new Error(`Cannot find ${path}`);
  }

  const content = host.read(path).toString('utf-8');

  const source = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  return { content, source };
}
