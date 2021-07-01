import { readTsSourceFile } from '../../../utils/ast-utils';
import { addReactOutputtarget } from './react';
import { addVueOutputtarget } from './vue';
import { addAngularOutputtarget } from './angular';
import * as ts from 'typescript';
import { getWorkspaceLayout, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { OutputTargetType } from '../schema';

export function addToOutputTargetToConfig(
  host: Tree,
  projectName: string,
  outputType: OutputTargetType
) {
  const stencilProjectConfig = readProjectConfiguration(host, projectName);
  const { npmScope } = getWorkspaceLayout(host);

  const stencilConfigPath = `${stencilProjectConfig.root}/stencil.config.ts`;
  const stencilConfigSource: ts.SourceFile = readTsSourceFile(
    host,
    stencilConfigPath
  );

  const packageName = `@${npmScope}/${projectName}`;

  if (outputType === 'react') {
    addReactOutputtarget(
      host,
      projectName,
      stencilProjectConfig,
      stencilConfigPath,
      stencilConfigSource,
      packageName
    );
  }

  if (outputType === 'vue') {
    addVueOutputtarget(
      host,
      projectName,
      stencilProjectConfig,
      stencilConfigPath,
      stencilConfigSource,
      packageName
    );
  }

  if (outputType === 'angular') {
    addAngularOutputtarget(
      host,
      projectName,
      stencilProjectConfig,
      stencilConfigPath,
      stencilConfigSource,
      packageName
    );
  }
}
