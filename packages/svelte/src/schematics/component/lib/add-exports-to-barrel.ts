import * as ts from 'typescript';
import * as path from 'path';
import { Rule, Tree } from '@angular-devkit/schematics';

import { insert, addGlobal, getProjectConfig, ProjectType } from '@nrwl/workspace';
import { ComponentSchema } from '../component';
import { names } from '@nrwl/devkit';

export function addExportsToBarrel(options: ComponentSchema): Rule {
  return (tree: Tree) => {
    const projectConfig = getProjectConfig(tree, options.project);

    const name = names(options.name);
    const projectDirectory = options.directory
      ? path.join(path.normalize(options.directory))
      : path.join(path.normalize(''));
    const creationDir = path.join(path.normalize(projectConfig.sourceRoot), 'components', projectDirectory);
    const componentFile = path.join(creationDir, name.fileName, `${name.className}.svelte`);
    const indexFilePath = path.join(projectConfig.sourceRoot, 'index.ts');
    const relativeComponentFilePath = path.relative(projectConfig.sourceRoot, componentFile);

    if(projectConfig.projectType === ProjectType.Library) {
      const buffer = tree.read(indexFilePath);
      if (!!buffer) {
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
            `export { default as default } from '${relativeComponentFilePath}';`
          )
        ]);
      }
    }

    return tree;
  };
}
