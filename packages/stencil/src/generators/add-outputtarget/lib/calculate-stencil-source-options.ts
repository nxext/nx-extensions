import { getWorkspaceLayout, readProjectConfiguration, Tree } from '@nx/devkit';
import * as ts from 'typescript';
import { readTsSourceFile } from '../../../utils/ast-utils';

export function calculateStencilSourceOptions(host: Tree, projectName: string) {
  const stencilProjectConfig = readProjectConfiguration(host, projectName);
  const { npmScope } = getWorkspaceLayout(host);

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
