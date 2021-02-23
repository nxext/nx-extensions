import { Tree } from '@angular-devkit/schematics';

import { createTestUILib, runSchematic } from '../../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJsonInTree } from '@nrwl/workspace';

describe('make-lib-buildable schematic', () => {
  let tree: Tree;
  const name = uniq('testproject');
  const options: MakeLibBuildableSchema = { name, style: SupportedStyles.css };

  beforeEach(async () => {
    tree = await createTestUILib(name, SupportedStyles.css, false);
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('make-lib-buildable', options, tree)
    ).resolves.not.toThrowError();
  });

  it('should add outputTargets', async () => {
    const result = await runSchematic('make-lib-buildable', options, tree);

    expect(result.readContent(`libs/${name}/stencil.config.ts`))
      .toEqual(`import { Config } from '@stencil/core';

export const config: Config = {
  namespace: '${name}',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      dir: '../../dist/libs/${name}/dist',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'www',
      dir: '../../dist/libs/${name}/www',
      serviceWorker: null,
    },
  ],
};
`);
  });

  it('should add outputTargets', async () => {
    const result = await runSchematic('make-lib-buildable', options, tree);

    const packageJson = readJsonInTree(result, `libs/${name}/package.json`);
    expect(packageJson['name']).toEqual(`@nxext/${name}`);
  });
});
