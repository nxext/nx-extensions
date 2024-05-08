import { CompilerSystem, createNodeSys } from '@stencil/core/sys/node';

import { loadCoreCompiler } from './stencil-process';

function getCompilerExecutingPath(): string {
  return require.resolve('@stencil/core/compiler');
}

describe('process', () => {
  describe('loadCoreCompiler', () => {
    it('should return globalThis.stencil', async () => {
      const sys: CompilerSystem = createNodeSys({ process });

      if (sys.getCompilerExecutingPath == null) {
        sys.getCompilerExecutingPath = getCompilerExecutingPath;
      }

      expect(globalThis.stencil).toBeUndefined();

      await loadCoreCompiler(sys);

      expect(globalThis.stencil).toBeTruthy();
    });
  });
});
