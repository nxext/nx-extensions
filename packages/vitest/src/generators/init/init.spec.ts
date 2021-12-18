import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';

import vitestInitGenerator from './init';
import { InitGeneratorSchema } from './schema';

describe('Vitest init generator', () => {
  let host: Tree;
  const options: InitGeneratorSchema = {};

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  it('should add necessary dependencies', async () => {
    await vitestInitGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['vitest']).toBeDefined();
    expect(packageJson.devDependencies['@nxext/vitest']).toBeDefined();
  })

  it('should generate the base config', async () => {
    await vitestInitGenerator(host, options);

    expect(host.exists('vitest.config.ts')).toBeTruthy();
  })
});
