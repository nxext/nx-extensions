import { RawSvelteBuildOptions } from './schema';
import { MockBuilderContext } from '@nrwl/workspace/testing';
import { getMockContext } from '@nrwl/workspace/src/utils/testing';
import { createRollupOptions } from '../utils/rollup-options';
import { normalizeOptions } from '../utils/normalize';
import { InitOptions } from '../utils/init-rollup-options';
import { RollupOptions } from 'rollup';

describe('Command Runner Builder', () => {
  let context: MockBuilderContext;
  let testOptions: RawSvelteBuildOptions;
  let initOptions: InitOptions;

  beforeEach(async () => {
    context = await getMockContext();
    context.target.project = 'example';
    testOptions = {
      entryFile: 'libs/ui/src/index.ts',
      outputPath: 'dist/ui',
      tsConfig: 'libs/ui/tsconfig.json',
      watch: false,
    };

    initOptions = {
      projectRoot: '/root/testproject',
      projectName: 'testproject',
      workspaceRoot: '/root',
    };
  });

  describe('createRollupOptions', () => {
    xit('should', () => {
      const result: RollupOptions = createRollupOptions(
        normalizeOptions(testOptions, initOptions),
        [],
        context
      );

      expect(result).toEqual({});
    });
  });
});
