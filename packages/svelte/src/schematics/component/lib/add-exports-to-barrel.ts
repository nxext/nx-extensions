import * as ts from 'typescript';
import { Rule, Tree } from '@angular-devkit/schematics';

import { insert, addGlobal, getProjectConfig, ProjectType } from '@nrwl/workspace';
import { SvelteComponentSchema } from '../component';
import { names } from '@nrwl/devkit';
import { join } from 'path';

export function addExportsToBarrel(options: SvelteComponentSchema): Rule {
  return (tree: Tree) => {
    const projectConfig = getProjectConfig(tree, options.project);

    const { className, fileName } = names(options.name);
    const indexFilePath = join(projectConfig.sourceRoot, 'index.ts');
    const componentFile = `./components/${fileName}/${className}.svelte`;

    if(projectConfig.projectType === ProjectType.Library) {
      const buffer = tree.read(indexFilePath);

      if (buffer) {
        const indexSource = buffer!.toString('utf-8');
        const indexSourceFile = ts.createSourceFile(
          indexFilePath,
          indexSource,
          ts.ScriptTarget.Latest,
          true
        );

        insert(tree, indexFilePath, [
          ...addGlobal(
            indexSourceFile,
            indexFilePath,
            `export { default as default } from '${componentFile}';`
          )
        ]);
      }
    }

    return tree;
  };
}
