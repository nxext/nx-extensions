import { createTestUILib } from '../../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, Tree } from '@nrwl/devkit';
import { makeLibBuildableGenerator } from './make-lib-buildable';

describe('make-lib-buildable schematic', () => {
  let tree: Tree;
  const name = uniq('testproject');
  const options: MakeLibBuildableSchema = {
    name,
    style: SupportedStyles.css,
    importPath: '@my/lib',
  };

  beforeEach(async () => {
    tree = await createTestUILib(name, SupportedStyles.css, false);
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(tree, options);

    expect(tree.read(`libs/${name}/stencil.config.ts`).toString('utf-8'))
      .toMatchInlineSnapshot(`
      "import { Config } from '@stencil/core';

      export const config: Config = {
        namespace: '${name}',
        taskQueue: 'async'
      ,
        outputTargets: [{
                  type: 'dist',
                  esmLoaderPath: '../loader',
                  dir: '../../dist/libs/${name}/dist',
                }]

      };
      "
    `);
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(tree, options);

    const packageJson = readJson(tree, `libs/${name}/package.json`);
    expect(packageJson['name']).toEqual(`@my/lib`);
  });
});
