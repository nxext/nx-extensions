import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nxext/devkit';

import generator from './vitest-project';
import { VitestProjectGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/workspace';

describe('vitest-project generator', () => {
  let host: Tree;
  const options: VitestProjectGeneratorSchema = {
    project: 'test',
    framework: 'generic',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    libraryGenerator(host, { name: 'test' });
  });

  it('should run successfully', async () => {
    await generator(host, options);

    const config = readProjectConfiguration(host, 'test');
    expect(config).toBeDefined();
  });
});
