import * as ts from 'typescript';
import { addToPlugins } from './plugins';
import { applyChangesToString, StringChange, Tree } from '@nx/devkit';
import { readTsSourceFile, addImport } from '@nxext/common';

export enum SupportedStyles {
  css = 'css',
  scss = 'scss',
}

export function addStylePlugin(
  stencilConfigSource: ts.SourceFile,
  style: SupportedStyles
): StringChange[] {
  const styleImports = {
    [SupportedStyles.css]: [],
    [SupportedStyles.scss]: [
      ...addImport(stencilConfigSource, `import { sass } from '@stencil/sass'`),
      ...addToPlugins(stencilConfigSource, 'sass()'),
    ],
  };

  return styleImports[style];
}

export function addStylePluginToConfig(
  host: Tree,
  stencilConfigPath: string,
  style: SupportedStyles
): void {
  const stencilConfigSource: ts.SourceFile = readTsSourceFile(
    host,
    stencilConfigPath
  );

  const changes = applyChangesToString(
    stencilConfigSource.text,
    addStylePlugin(stencilConfigSource, style)
  );

  host.write(stencilConfigPath, changes);
}
