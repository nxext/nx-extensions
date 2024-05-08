import { runTask } from '@stencil/core/cli';
import type { Config } from '@stencil/core/compiler';
import { CompilerSystem } from '@stencil/core/sys/node';

type CoreCompiler = typeof import('@stencil/core/compiler');

export const loadCoreCompiler = async (
  sys: CompilerSystem
): Promise<CoreCompiler> => {
  const coreCompiler: CoreCompiler = await sys.dynamicImport(
    sys.getCompilerExecutingPath()
  );

  if (!('stencil' in globalThis)) {
    globalThis.stencil = coreCompiler;
  }

  return globalThis.stencil;
};

export async function createStencilProcess(config: Config): Promise<void> {
  const coreCompiler = await loadCoreCompiler(config.sys);

  await runTask(coreCompiler, config, config.flags.task);
}
