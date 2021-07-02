import { ProjectType } from '@nrwl/workspace';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/devkit/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { RawLibrarySchema } from './schema';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from './schematic';

describe('library', () => {
  let host: Tree;
  const options: RawLibrarySchema = { name: 'test', buildable: false, publishable: false };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  it('should create files', async () => {
    await libraryGenerator(host, options);

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      ProjectType.Library
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should create files in specified dir', async () => {
    await libraryGenerator(host, { ...options, directory: 'subdir' });

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      ProjectType.Library,
      'subdir'
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should add Stencil Library dependencies', async () => {
    await libraryGenerator(host, options);
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to lib`, async () => {
      await libraryGenerator(host, { ...options, style: SupportedStyles[style] });
      const packageJson = readJson(host, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add component config for ${style} to workspace config`, async () => {
      await libraryGenerator(host, { ...options, style: SupportedStyles[style] });

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style
        },
      });
    });
  });

  describe('default libraries', () => {
    const options: RawLibrarySchema = { name: 'testlib', buildable: false, publishable: false };

    it('shouldnt create build targets if not buildable', async () => {
      await libraryGenerator(host, options);

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.targets['build']).toBeUndefined();
      expect(projectConfig.targets['e2e']).toBeUndefined();
      expect(projectConfig.targets['serve']).toBeUndefined();
    });

    it('should export component', async () => {
      await libraryGenerator(host, options);

      expect(host.read('libs/testlib/src/components.d.ts').toString('utf-8')).toContain(
        "export * from './components/my-component/my-component';"
      );
    });

    it('shouldnt create build files', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(host.exists('libs/testlib/src/index.html')).toBeFalsy();
      expect(host.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });

  describe('buildable libraries', () => {
    const options: RawLibrarySchema = { name: 'testlib', buildable: true, publishable: false };

    it('should create build targets', async () => {
      await libraryGenerator(host, options);

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.targets['build']).toBeDefined();
      expect(projectConfig.targets['e2e']).toBeDefined();
      expect(projectConfig.targets['serve']).toBeDefined();
    });

    it('should export bundle', async () => {
      await libraryGenerator(host, options);

      expect(host.read('libs/testlib/src/index.ts').toString('utf-8')).toContain(
        "export * from './components';"
      );
    });

    it('should create build files', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(host.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });

  describe('publishable libraries', () => {
    const options: RawLibrarySchema = { name: 'testlib', buildable: false, publishable: true, importPath: '@myorg/mylib' };

    it('should throw error if publishable without importPath', async () => {
      try {
        await libraryGenerator(host, {
          name: options.name,
          buildable: false,
          publishable: true
        });
      } catch (error) {
        expect(error.message).toContain(
          'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)'
        );
      }
    });

    it('should create build targets', async () => {
      await libraryGenerator(host, options);

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.targets['build']).toBeDefined();
      expect(projectConfig.targets['e2e']).toBeDefined();
      expect(projectConfig.targets['serve']).toBeDefined();
    });

    it('should export bundle', async () => {
      await libraryGenerator(host, options);

      expect(host.read('libs/testlib/src/index.ts').toString('utf-8')).toContain(
        "export * from './components';"
      );
    });

    it('should create build files', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(host.exists('libs/testlib/package.json')).toBeTruthy();
      expect(host.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });

    it('should update importPath', async () => {
      await libraryGenerator(host, options);
      const pkgJson = readJson(host, 'libs/testlib/package.json');

      expect(pkgJson.name).toBe('@myorg/mylib');
    });
  });
});
