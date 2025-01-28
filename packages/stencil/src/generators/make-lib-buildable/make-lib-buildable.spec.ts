import { uniq } from '@nx/plugin/testing';
import { MakeLibBuildableSchema } from './schema';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, Tree, updateJson } from '@nx/devkit';
import { makeLibBuildableGenerator } from './make-lib-buildable';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from '../library/generator';

describe('make-lib-buildable schematic', () => {
  let host: Tree;
  const projectName = uniq('testprojekt');
  const projectAppDirectory = `apps/${projectName}`;
  const projectLibDirectory = `libs/${projectName}`;
  const options: MakeLibBuildableSchema = {
    name: projectName,
    style: SupportedStyles.css,
    importPath: '@my/lib',
  };

  beforeEach(async () => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nx/workspace': '17.0.0',
      };
      return json;
    });
    await libraryGenerator(host, {
      directory: projectLibDirectory,
      style: SupportedStyles.css,
      importPath: options.importPath,
      buildable: false,
      publishable: false,
    });
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(host, options);

    expect(host.read(`libs/${projectName}/stencil.config.ts`).toString('utf-8'))
      .toMatchInlineSnapshot(`
      "import { Config } from '@stencil/core';

      export const config: Config = {
        namespace: '${projectName}',
        taskQueue: 'async',
        sourceMap: true,

        extras: {
          experimentalImportInjection: true,
        },
        outputTargets: [
          {
            type: 'dist',
            esmLoaderPath: '../loader',
          },
          {
            type: 'dist-custom-elements',
          },
          {
            type: 'docs-readme',
          },
          {
            type: 'www',
            serviceWorker: null, // disable service workers
          },
          {
            type: 'dist-hydrate-script',
            dir: 'dist/hydrate',
          },
          {
            type: 'dist-custom-elements',
            customElementsExportBehavior: 'auto-define-custom-elements',
            includeGlobalScripts: false,
          },
        ],
      };
      "
    `);
  });

  it('should add outputTargets', async () => {
    await makeLibBuildableGenerator(host, options);

    const packageJson = readJson(host, `libs/${projectName}/package.json`);
    expect(packageJson['name']).toEqual(`@my/lib`);
  });

  it(`should set path in tsconfig for buildable libs`, async () => {
    await makeLibBuildableGenerator(host, options);
    const tsConfig = readJson(host, 'tsconfig.base.json');

    expect(tsConfig.compilerOptions.paths['@my/lib']).toEqual([
      `dist/libs/${projectName}`,
    ]);
  });
});

describe('make-lib-buildable schematic using defaults', () => {
  let host: Tree;
  const projectName = uniq('testprojekt');
  const projectAppDirectory = `apps/${projectName}`;
  const projectLibDirectory = `libs/${projectName}`;
  const options: MakeLibBuildableSchema = {
    name: projectName,
    style: SupportedStyles.css,
  };

  beforeEach(async () => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    await libraryGenerator(host, {
      directory: projectLibDirectory,
      style: SupportedStyles.css,
      importPath: options.importPath,
      buildable: false,
      publishable: false,
    });
  });

  it(`should set default path in tsconfig for buildable libs`, async () => {
    await makeLibBuildableGenerator(host, options);
    const tsConfig = readJson(host, 'tsconfig.base.json');

    expect(tsConfig.compilerOptions.paths[`@proj/${projectName}`]).toEqual([
      `dist/libs/${projectName}`,
    ]);
  });
});
