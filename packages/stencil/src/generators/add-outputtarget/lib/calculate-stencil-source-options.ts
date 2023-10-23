import { readProjectConfiguration, Tree } from '@nx/devkit';
import { getNpmScope } from '@nx/js/src/utils/package-json/get-npm-scope';
import * as ts from 'typescript';
import { readTsSourceFile } from '@nxext/common';

export function calculateStencilSourceOptions(host: Tree, projectName: string) {
  const stencilProjectConfig = readProjectConfiguration(host, projectName);
  const npmScope = getNpmScope(host);

  const stencilConfigPath = `${stencilProjectConfig.root}/stencil.config.ts`;
  const stencilConfigSource: ts.SourceFile = readTsSourceFile(
    host,
    stencilConfigPath
  );

  const packageName = `@${npmScope}/${projectName}`;
  return {
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName,
  };
}
