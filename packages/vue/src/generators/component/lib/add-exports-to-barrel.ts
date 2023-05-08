import {
  applyChangesToString,
  getProjects,
  Tree,
  joinPathFragments,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { addImport } from '../../utils/ast-utils';
import * as ts from 'typescript';

export function addExportsToBarrel(host: Tree, options: NormalizedSchema) {
  const workspace = getProjects(host);
  const isApp = workspace.get(options.project).projectType === 'application';

  if (options.export && !isApp) {
    const indexFilePath = joinPathFragments(
      options.projectSourceRoot,
      'index.ts'
    );
    const indexSource = host.read(indexFilePath, 'utf-8');
    if (indexSource !== null) {
      const indexSourceFile = ts.createSourceFile(
        indexFilePath,
        indexSource,
        ts.ScriptTarget.Latest,
        true
      );
      const changes = applyChangesToString(
        indexSource,
        addImport(
          indexSourceFile,
          `export { default as ${options.fileName} } from './${options.directory}/${options.fileName}.vue';`
        )
      );
      host.write(indexFilePath, changes);
    }
  }
}
