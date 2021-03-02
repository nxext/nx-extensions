import { RawSvelteBuildOptions } from './schema';
import { createRollupOptions } from '../utils/rollup-options';
import executor from './builder';
import { ExecutorContext } from '@nrwl/devkit';

describe('Command Runner Builder', () => {
  let context: ExecutorContext;
  let testOptions: RawSvelteBuildOptions;

  beforeEach(async () => {
    context = {
      root: '/root',
      cwd: '/root',
      workspace: {
        version: 2,
        projects: {},
      },
      isVerbose: false,
      projectName: 'example',
      targetName: 'build',
    };
    testOptions = {
      entryFile: 'libs/ui/src/index.ts',
      outputPath: 'dist/ui',
      project: 'example',
      tsConfig: 'libs/ui/tsconfig.json',
      watch: false,
    };
  });

  describe('createRollupOptions', () => {
    xit('should', async () => {
      const output = await executor(testOptions, context);
      expect(output.success).toBe(true);
    });
  });
});
