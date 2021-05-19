import { createTestUILib } from '../../utils/devkit/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, Tree } from '@nrwl/devkit';
import { makeLibBuildableGenerator } from './make-lib-buildable';

describe('make-lib-buildable schematic', () => {
  let host: Tree;
  const name = uniq('testproject');
  const options: MakeLibBuildableSchema = { name, style: SupportedStyles.css, importPath: '@my/lib' };

  beforeEach(async () => {
    host = await createTestUILib(name, SupportedStyles.css, false);
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(host, options);

    expect(host.read(`libs/${name}/stencil.config.ts`).toString())
      .toEqual(`import { Config } from '@stencil/core';

export const config: Config = {
  namespace: '${name}',
  taskQueue: 'async'
,
  outputTargets: [{
          type: 'dist',
          esmLoaderPath: '../loader',
          dir: '../../dist/libs/${name}/dist',
        }]
,
};
`);
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(host, options);

    const packageJson = readJson(host, `libs/${name}/package.json`);
    expect(packageJson['name']).toEqual(`@my/lib`);
  });
});
