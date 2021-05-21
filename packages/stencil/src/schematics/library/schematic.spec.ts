import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { getProjectConfig, ProjectType, readJsonInTree } from '@nrwl/workspace';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType, runSchematic } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { RawLibrarySchema } from './schema';

describe('schematic:library', () => {
  let tree: Tree;
  const options: RawLibrarySchema = { name: 'test', buildable: false, publishable: false };

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should create files', async () => {
    const result = await runSchematic(
      'lib',
      options,
      tree
    );

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      ProjectType.Library
    );
    fileList.forEach((file) => expect(result.exists(file)));
  });

  it('should create files in specified dir', async () => {
    const result = await runSchematic(
      'lib',
      { ...options, subdir: 'subdir' },
      tree
    );

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      ProjectType.Library,
      'subdir'
    );
    fileList.forEach((file) => expect(result.exists(file)));
  });

  it('should add Stencil Library dependencies', async () => {
    const result = await runSchematic('lib', { name: 'test' }, tree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to lib`, async () => {
      const result = await runSchematic(
        'lib',
        { ...options, style: style },
        tree
      );
      const packageJson = readJsonInTree(result, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add component config for ${style} to workspace config`, async () => {
      tree = await runSchematic(
        'app',
        { ...options, style: style },
        tree
      );

      const projectConfig = getProjectConfig(tree, options.name);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style,
          storybook: false,
        },
      });
    });
  });

  describe('default libraries', () => {
    const options: RawLibrarySchema = { name: 'testlib', buildable: false, publishable: false };

    it('shouldnt create build targets if not buildable', async () => {
      const result = await runSchematic('lib', options, tree);

      const projectConfig = getProjectConfig(result, options.name);
      expect(projectConfig.targets['build']).toBeUndefined();
      expect(projectConfig.targets['e2e']).toBeUndefined();
      expect(projectConfig.targets['serve']).toBeUndefined();
    });

    it('should export component', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.readContent('libs/testlib/src/components.d.ts')).toContain(
        "export * from './components/my-component/my-component';"
      );
    });

    it('shouldnt create build files', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(result.exists('libs/testlib/src/index.html')).toBeFalsy();
      expect(result.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });

  describe('buildable libraries', () => {
    const options: RawLibrarySchema = { name: 'testlib', buildable: true, publishable: false };

    it('should create build targets', async () => {
      const result = await runSchematic('lib', options, tree);

      const projectConfig = getProjectConfig(result, options.name);
      expect(projectConfig.architect['build']).toBeDefined();
      expect(projectConfig.architect['e2e']).toBeDefined();
      expect(projectConfig.architect['serve']).toBeDefined();
    });

    it('should export bundle', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.readContent('libs/testlib/src/index.ts')).toContain(
        "export * from './components';"
      );
    });

    it('should create build files', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(result.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });

  describe('publishable libraries', () => {
    const options: RawLibrarySchema = { name: 'testlib', buildable: false, publishable: true, importPath: '@myorg/mylib' };

    it('should throw error if publishable without importPath', async () => {
      try {
        await runSchematic('lib', {
          name: options.name,
          buildable: false,
          publishable: true
        }, tree);
      } catch (error) {
        expect(error.message).toContain(
          'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)'
        );
      }
    });

    it('should create build targets', async () => {
      const result = await runSchematic('lib', options, tree);

      const projectConfig = getProjectConfig(result, options.name);
      expect(projectConfig.architect['build']).toBeDefined();
      expect(projectConfig.architect['e2e']).toBeDefined();
      expect(projectConfig.architect['serve']).toBeDefined();
    });

    it('should export bundle', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.readContent('libs/testlib/src/index.ts')).toContain(
        "export * from './components';"
      );
    });

    it('should create build files', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(result.exists('libs/testlib/package.json')).toBeTruthy();
      expect(result.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });

    it('should update importPath', async () => {
      const result = await runSchematic('lib', options, tree);
      const pkgJson = readJsonInTree(result, 'libs/testlib/package.json');

      expect(pkgJson.name).toBe('@myorg/mylib');
    });
  });
});
