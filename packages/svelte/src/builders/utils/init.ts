import { BuilderContext } from '@angular-devkit/architect';
import { normalize, Path } from '@angular-devkit/core';
import { RawSvelteBuildOptions } from '../build/schema';
import { normalizeOptions } from './normalize';
import * as rollup from 'rollup';
import { DependentBuildableProjectNode } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { createRollupOptions } from './rollup';

export interface InitOptions {
  projectRoot: string;
  projectName: string;
  workspaceRoot: string;
}

export async function initRollupOptions(
  options: RawSvelteBuildOptions,
  dependencies: DependentBuildableProjectNode[],
  context: BuilderContext
): Promise<rollup.RollupOptions> {
  const { workspaceRoot } = context;
  const projectName: string = context.target.project;
  const metadata = await context.getProjectMetadata(context.target);
  const projectRoot: Path = normalize(`${workspaceRoot}/${metadata.root}`);

  const initOptions: InitOptions = {
    projectRoot,
    projectName,
    workspaceRoot,
  };

  return createRollupOptions(
    normalizeOptions(options, initOptions),
    dependencies,
    context
  );
}
