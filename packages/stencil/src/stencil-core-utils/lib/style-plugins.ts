import { Change, insertImport } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';
import { addToPlugins } from './plugins';
import { Rule, Tree } from '@angular-devkit/schematics';
import { insert } from '@nrwl/workspace';
import { readTsSourceFileFromTree } from '../../utils/ast-utils';

export enum SupportedStyles {
  css = 'css',
  scss = 'scss',
  styl = 'styl',
  less = 'less',
  pcss = 'pcss'
}

export function addStylePlugin(
  stencilConfigSource: ts.SourceFile,
  stencilConfigPath: string,
  style: SupportedStyles): Change[] {
  const styleImports = {
    [SupportedStyles.css]: [],
    [SupportedStyles.scss]: [
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'sass',
        '@stencil/sass'
      ),
      ...addToPlugins(
        stencilConfigSource,
        stencilConfigPath,
        'sass()'
      )
    ],
    [SupportedStyles.styl]: [
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'stylus',
        '@stencil/stylus'
      ),
      ...addToPlugins(
        stencilConfigSource,
        stencilConfigPath,
        'stylus()'
      )
    ],
    [SupportedStyles.less]: [
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'less',
        '@stencil/less'
      ),
      ...addToPlugins(
        stencilConfigSource,
        stencilConfigPath,
        'less()'
      )
    ],
    [SupportedStyles.pcss]: [
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'postcss',
        '@stencil/postcss'
      ),
      insertImport(
        stencilConfigSource,
        stencilConfigPath,
        'autoprefixer',
        'autoprefixer'
      ),
      ...addToPlugins(
        stencilConfigSource,
        stencilConfigPath,
        `
          postcss({
            plugins: [autoprefixer()]
          })
          `
      )
    ]
  };

  return styleImports[style];
}

export function addStylePluginToConfigInTree(stencilConfigPath: string, style: SupportedStyles): Rule {
  return (tree: Tree) => {
    const stencilConfigSource: ts.SourceFile = readTsSourceFileFromTree(
      tree,
      stencilConfigPath
    );

    insert(tree, stencilConfigPath,
      addStylePlugin(stencilConfigSource, stencilConfigPath, style)
    );

    return tree;
  };
}
