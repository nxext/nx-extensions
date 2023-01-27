import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import {
  Tree,
  readProjectConfiguration,
  addDependenciesToPackageJson,
  readJson,
} from '@nrwl/devkit';

import { libraryGenerator } from './library';
import { Schema } from './schema';
import { Linter } from '@nrwl/linter';

describe('library generator', () => {
  let host: Tree;
  const projectName = 'my-lib';
  const options: Schema = {
    name: projectName,
    unitTestRunner: 'none',
    linter: Linter.EsLint,
  };

  beforeEach(() => {
    host = createTreeWithEmptyV1Workspace();
    addDependenciesToPackageJson(host, {}, { '@nrwl/workspace': '15.5.0' });
  });

  it('should run successfully', async () => {
    await libraryGenerator(host, options);
    const config = readProjectConfiguration(host, projectName);
    expect(config).toBeDefined();
  });

  describe('--component', () => {
    it('should generate component if true', async () => {
      await libraryGenerator(host, { ...options, component: true });
      expect(host.exists(`libs/${projectName}/src/index.ts`)).toBeTruthy();
      expect(
        host.exists(`libs/${projectName}/src/components/MyLib.vue`)
      ).toBeTruthy();
    });

    it('should not generate component if false', async () => {
      await libraryGenerator(host, { ...options, component: false });
      expect(host.exists(`libs/${projectName}/src/index.ts`)).toBeTruthy();
      expect(
        host.exists(`libs/${projectName}/src/components/MyLib.vue`)
      ).toBeFalsy();
    });
  });

  it('should update root tsconfig.base.json', async () => {
    await libraryGenerator(host, options);
    const tsconfigJson = readJson(host, '/tsconfig.base.json');
    expect(tsconfigJson.compilerOptions.paths['@proj/my-lib']).toEqual([
      'libs/my-lib/src/index.ts',
    ]);
  });

  it('should add vue dependencies packages to package.json if not already present', async () => {
    await libraryGenerator(host, options);

    const packageJson = readJson(host, '/package.json');

    expect(packageJson).toMatchObject({
      dependencies: {
        vue: expect.anything(),
        'vue-tsc': expect.anything(),
      },
      devDependencies: {
        '@vitejs/plugin-vue': expect.anything(),
      },
    });
  });

  it('should update tags', async () => {
    await libraryGenerator(host, { ...options, tags: 'foo,bar' });
    const project = readProjectConfiguration(host, 'my-lib');
    expect(project).toEqual(
      expect.objectContaining({
        tags: ['foo', 'bar'],
      })
    );
  });
});
