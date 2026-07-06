import { readProjectConfiguration, Tree } from '@nx/devkit';
import * as ts from 'typescript';
import { readTsSourceFile } from '@nxext/common';
import { getProjectTsImportPath } from '../../storybook-configuration/generator';

export function calculateStencilSourceOptions(host: Tree, projectName: string) {
  const stencilProjectConfig = readProjectConfiguration(host, projectName);

  const stencilConfigPath = `${stencilProjectConfig.root}/stencil.config.ts`;
  const stencilConfigSource: ts.SourceFile = readTsSourceFile(
    host,
    stencilConfigPath
  );

  // Same derivation as `getProjectTsImportPath` (Design 2.5): prefer the
  // project's real package.json name (its actual importPath) over the
  // npmScope-based guess, which only matches by coincidence when nobody
  // passed an explicit `--importPath`.
  const packageName = getProjectTsImportPath(host, projectName);
  return {
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName,
  };
}
