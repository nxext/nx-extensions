import { uniq } from '@nrwl/nx-plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, Tree } from '@nrwl/devkit';
import { makeLibBuildableGenerator } from './make-lib-buildable';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '../library/generator';

describe('make-lib-buildable schematic', () => {
  let host: Tree;
  const name = uniq('testproject');
  const options: MakeLibBuildableSchema = {
    name,
    style: SupportedStyles.css,
    importPath: '@my/lib',
  };

  beforeEach(async () => {
    host = createTreeWithEmptyWorkspace();
    await libraryGenerator(host, {
      name: options.name,
      style: SupportedStyles.css,
      importPath: options.importPath,
      buildable: false,
      publishable: false
    });
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(host, options);

    expect(host.read(`libs/${name}/stencil.config.ts`).toString('utf-8'))
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
            },{
              type: 'www',
              dir: '../../dist/libs/${name}/www',
              serviceWorker: null // disable service workers
            }]

      };
      "
    `);
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(host, options);

    const packageJson = readJson(host, `libs/${name}/package.json`);
    expect(packageJson['name']).toEqual(`@my/lib`);
  });

  it(`should set path in tsconfig for buildable libs`, async () => {
    await makeLibBuildableGenerator(host, options);
    const tsConfig = readJson(host, 'tsconfig.base.json');

    expect(
      tsConfig.compilerOptions.paths['@my/lib']
    ).toEqual([`dist/libs/${name}`]);
  });
});
