import * as ts from 'typescript';
import { addToPlugins } from './plugins';
import { applyChangesToString, StringChange, Tree } from '@nx/devkit';
import { addImport, readTsSourceFile } from '../../utils/ast-utils';

export enum SupportedStyles {
  css = 'css',
  scss = 'scss',
  styl = 'styl',
  less = 'less',
  pcss = 'pcss',
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
    [SupportedStyles.styl]: [
      ...addImport(
        stencilConfigSource,
        `import { stylus } from '@stencil/stylus'`
      ),
      ...addToPlugins(stencilConfigSource, 'stylus()'),
    ],
    [SupportedStyles.less]: [
      ...addImport(stencilConfigSource, `import { less } from '@stencil/less'`),
      ...addToPlugins(stencilConfigSource, 'less()'),
    ],
    [SupportedStyles.pcss]: [
      ...addImport(
        stencilConfigSource,
        `import { postcss } from '@stencil/postcss'`
      ),
      ...addImport(
        stencilConfigSource,
        `import autoprefixer from 'autoprefixer'`
      ),
      ...addToPlugins(
        stencilConfigSource,
        `
          postcss({
            plugins: [autoprefixer()]
          })
          `
      ),
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
