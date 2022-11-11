import { CompilerSystem, runTask } from '@stencil/core/cli';
import type { Config } from '@stencil/core/compiler';

type CoreCompiler = typeof import('@stencil/core/compiler');

export const loadCoreCompiler = async (
  sys: CompilerSystem
): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export async function createStencilProcess(config: Config): Promise<void> {
  const coreCompiler = await loadCoreCompiler(config.sys);

  await runTask(coreCompiler, config, config.flags.task);
}
