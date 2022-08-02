import { CompilerSystem, runTask } from '@stencil/core/cli';
import { cleanupE2eTesting } from './e2e-testing';
import { PathCollection } from './types';
import type { Config } from '@stencil/core/compiler';

type CoreCompiler = typeof import('@stencil/core/compiler');

export const loadCoreCompiler = async (
  sys: CompilerSystem
): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export async function createStencilProcess(
  config: Config,
  pathCollection: PathCollection
) {
  const coreCompiler = await loadCoreCompiler(config.sys);
  await runTask(coreCompiler, config, config.flags.task);

  if (config.flags.e2e) {
    cleanupE2eTesting(pathCollection);
  }
}
