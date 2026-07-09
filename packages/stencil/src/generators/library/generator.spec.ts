import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { RawLibrarySchema } from './schema';
import {
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './generator';
import { createTsSolutionTree } from '@nxext/common';

describe('library', () => {
  let host: Tree;
  const options: RawLibrarySchema = {
    directory: 'libs/test',
    buildable: false,
    publishable: false,
    component: true,
    e2eTestRunner: 'none',
    importPath: '@e2e/test',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nx/workspace': '15.7.0',
      };
      return json;
    });
  });

  it('should add tags to nx.json', async () => {
    await libraryGenerator(host, { ...options, tags: 'e2etag,e2ePackage' });

    const projectConfig = readProjectConfiguration(
      host,
      options.directory.replace('libs/', ''),
    );
    expect(projectConfig.tags).toEqual(['e2etag', 'e2ePackage']);
  });

  it('should create files', async () => {
    await libraryGenerator(host, options);

    const fileList = fileListForAppType(
      options.directory,
      SupportedStyles.css,
      'library',
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it(`should set path in tsconfig`, async () => {
    await libraryGenerator(host, { ...options });
    const tsConfig = readJson(host, 'tsconfig.base.json');

    // Behavior change (deliberate, see report): now routed through
    // `@nxext/common`'s `maybeAddTsConfigPath` -> `@nx/js`'s `addTsConfigPath`
    // (Design 1.6/3.3 item 3) instead of a hand-rolled `updateJson`, which
    // normalizes the entry to a leading `./` (`ensureRelativePath`) -
    // functionally identical for TS path resolution, cosmetic only.
    expect(tsConfig.compilerOptions.paths['@e2e/test']).toEqual([
      `./libs/test/src/index.ts`,
    ]);
  });

  it(`shouldn't create default component if component=false`, async () => {
    await libraryGenerator(host, { ...options, component: false });

    expect(
      host.exists(`libs/${options.name}/src/components/my-component`),
    ).toBeFalsy();
    expect(
      host.exists(
        `libs/${options.name}/src/components/my-component/my-component.tsx`,
      ),
    ).toBeFalsy();
  });

  it('should create files in specified dir', async () => {
    await libraryGenerator(host, { ...options, directory: 'libs/subdir/test' });

    const fileList = fileListForAppType(
      options.directory,
      SupportedStyles.css,
      'library',
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should add Stencil Library dependencies', async () => {
    await libraryGenerator(host, options);
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@types/node']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to lib`, async () => {
      await libraryGenerator(host, {
        ...options,
        style: SupportedStyles[style],
      });
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
      await libraryGenerator(host, {
        ...options,
        style: SupportedStyles[style],
      });

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style,
        },
      });
    });
  });

  describe('default libraries', () => {
    const options: RawLibrarySchema = {
      directory: 'libs/testlib',
      buildable: false,
      publishable: false,
    };

    it('shouldnt create build targets if not buildable', async () => {
      await libraryGenerator(host, options);

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.targets['build']).toBeUndefined();
      expect(projectConfig.targets['e2e']).toBeUndefined();
      expect(projectConfig.targets['serve']).toBeUndefined();
    });

    it('should export component', async () => {
      await libraryGenerator(host, options);

      expect(
        host.read('libs/testlib/src/components.d.ts').toString('utf-8'),
      ).toContain("export * from './components/my-component/my-component';");
    });

    it('shouldnt create build files', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(host.exists('libs/testlib/src/index.html')).toBeFalsy();
      expect(host.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });

  describe('buildable libraries', () => {
    const options: RawLibrarySchema = {
      directory: 'libs/testlib',
      buildable: true,
      publishable: false,
      component: true,
    };

    const pluginForSupportedStyles = {
      [SupportedStyles.scss]: 'sass',
    };

    it('emits a stencil.config.ts so the Crystal plugin infers build targets', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
    });

    it('should export bundle', async () => {
      await libraryGenerator(host, options);

      expect(
        host.read('libs/testlib/src/index.ts').toString('utf-8'),
      ).toContain("export * from './components';");
    });

    it('should create build files', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(host.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });

    Object.keys(pluginForSupportedStyles).forEach((style) => {
      const plugin = pluginForSupportedStyles[style];

      it(`should import ${plugin} plugin`, async () => {
        await libraryGenerator(host, {
          ...options,
          style: style as SupportedStyles,
        });

        expect(
          host.read('libs/testlib/stencil.config.ts').toString('utf-8'),
        ).toContain(`import { ${plugin} } from '@stencil/${plugin}'`);
      });
    });
  });

  describe('publishable libraries', () => {
    const options: RawLibrarySchema = {
      directory: 'libs/testlib',
      buildable: false,
      publishable: true,
      importPath: '@myorg/mylib',
      component: true,
    };

    it('should throw error if publishable without importPath', async () => {
      try {
        await libraryGenerator(host, {
          ...options,
          importPath: void 0,
        });
      } catch (error) {
        expect(error.message).toContain(
          'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)',
        );
      }
    });

    it('emits a stencil.config.ts so the Crystal plugin infers build targets', async () => {
      await libraryGenerator(host, options);

      expect(host.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
    });

    it('should export bundle', async () => {
      await libraryGenerator(host, options);

      expect(
        host.read('libs/testlib/src/index.ts').toString('utf-8'),
      ).toContain("export * from './components';");
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

    it(`shouldn't create spec files if unitTestrunner is 'none'`, async () => {
      await libraryGenerator(host, { ...options, unitTestRunner: 'none' });

      expect(
        host.exists(
          `libs/testlib/src/components/my-component/my-component.spec.ts`,
        ),
      ).toBeFalsy();
    });

    it(`shouldn't create e2e files if e2eTestRunner is 'none'`, async () => {
      await libraryGenerator(host, { ...options, e2eTestRunner: 'none' });

      expect(
        host.exists(
          `libs/testlib/src/components/my-component/my-component.e2e.ts`,
        ),
      ).toBeFalsy();
    });

    it(`creates e2e files when e2eTestRunner is 'puppeteer'`, async () => {
      await libraryGenerator(host, { ...options, e2eTestRunner: 'puppeteer' });

      expect(
        host.exists(
          `libs/testlib/src/components/my-component/my-component.e2e.ts`,
        ),
      ).toBeTruthy();
    });
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;
    // `normalizeOptions` mutates whatever options object it's given
    // (`options.name ??= ...`) - the shared top-level `options` const is
    // passed directly (not spread) by earlier tests in this file, which
    // permanently poisons it for the rest of the suite. Use an entirely
    // independent literal here instead of deriving from `options`.
    let tsOptions: RawLibrarySchema;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
      tsOptions = {
        directory: 'libs/test',
        buildable: false,
        publishable: false,
        component: true,
        e2eTestRunner: 'none',
        importPath: '@e2e/test',
      };
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      expect(tsSolutionTree.exists('libs/test/project.json')).toBe(false);
      expect(tsSolutionTree.exists('libs/test/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'libs/test/package.json');
      expect(packageJson.name).toBe('@e2e/test');
    });

    it('points a non-buildable lib package.json straight at its source (no dist step)', async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      const packageJson = readJson(tsSolutionTree, 'libs/test/package.json');
      expect(packageJson.main).toBe('./src/index.ts');
      expect(packageJson.exports['.']).toEqual({
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      });
    });

    it('registers the project in pnpm-workspace.yaml but NOT in the root tsconfig.json references (non-composite Stencil project)', async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('libs');

      // Same rationale as the application generator: the generated
      // tsconfig.json is a standalone non-composite Stencil config, and
      // non-composite projects must not be referenced by the root solution
      // tsconfig (TS6306).
      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references ?? []).not.toEqual(
        expect.arrayContaining([{ path: './libs/test' }]),
      );
    });

    it('generates a standalone Stencil tsconfig.json that does NOT inherit the TS-solution base (composite/customConditions/nodenext are unbuildable for Stencil)', async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      const tsconfigJson = readJson(tsSolutionTree, 'libs/test/tsconfig.json');
      expect(tsconfigJson.extends).toBeUndefined();
      expect(tsconfigJson.compilerOptions.jsx).toBe('react');
      expect(tsconfigJson.compilerOptions.jsxFactory).toBe('h');
      expect(tsconfigJson.compilerOptions.module).toBe('esnext');
      // `bundler` is the only moduleResolution Stencil's own
      // getTsOptionsToExtend preserves - see the application spec.
      expect(tsconfigJson.compilerOptions.moduleResolution).toBe('bundler');
      expect(tsconfigJson.compilerOptions.composite).toBeUndefined();
      // Silences Stencil's `tsconfig.json "include" required` warning.
      expect(tsconfigJson.include).toEqual(['src']);
      // Jest-global-using test files must stay out of the config-level
      // program - see the application spec's identical assertion.
      expect(tsconfigJson.exclude).toEqual([
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.e2e.ts',
      ]);
      // No project references: with a non-empty `include`, TS redirects
      // source files of a referenced composite project (tsconfig.lib.json
      // sets composite: true) to its not-yet-built declaration outputs -
      // TS6305 ("Output file ... has not been built from source file") on
      // every src file, verified against a real Stencil build in the
      // ts-solution e2e.
      expect(tsconfigJson.references).toBeUndefined();
    });

    it('keeps the runtime tsconfig.lib.json extending the project tsconfig.json (same chain as legacy)', async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      const tsconfigLib = readJson(
        tsSolutionTree,
        'libs/test/tsconfig.lib.json',
      );
      expect(tsconfigLib.extends).toBe('./tsconfig.json');
    });

    it("uses the plain, scope-free project name for Stencil's own `namespace`, never the scoped importPath", async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      const stencilConfig = tsSolutionTree
        .read('libs/test/stencil.config.ts')
        .toString('utf-8');
      expect(stencilConfig).toContain("namespace: 'test'");
    });

    it('does not register a tsconfig.base.json paths entry (workspace symlinks resolve cross-project imports instead)', async () => {
      await libraryGenerator(tsSolutionTree, tsOptions);

      const tsconfigBase = readJson(tsSolutionTree, 'tsconfig.base.json');
      expect(tsconfigBase.compilerOptions.paths?.['@e2e/test']).toBeUndefined();
    });

    describe('buildable libraries', () => {
      let buildableOptions: RawLibrarySchema;

      beforeEach(() => {
        buildableOptions = {
          directory: 'libs/test',
          buildable: true,
          publishable: false,
          component: true,
          importPath: '@e2e/test',
        };
      });

      it('preserves the nx.targets/nx.generators metadata across make-lib-buildable overwriting package.json', async () => {
        await libraryGenerator(tsSolutionTree, buildableOptions);

        const packageJson = readJson(tsSolutionTree, 'libs/test/package.json');
        // make-lib-buildable's package.json.template has no `nx` field of its
        // own - without the priorNx capture/reapply in
        // make-lib-buildable.ts's createFiles, this would be lost entirely.
        expect(packageJson.nx.targets.lint).toBeDefined();
        expect(packageJson.nx.generators).toEqual({
          '@nxext/stencil:component': {
            style: SupportedStyles.css,
          },
        });
        // The buildable package.json template is now the authoritative
        // source for `name`/dist-output fields.
        expect(packageJson.name).toBe('@e2e/test');
        expect(packageJson.main).toBe('./dist/index.cjs.js');
      });

      it("still doesn't register a tsconfig.base.json paths entry for buildable libs in TS-solution mode", async () => {
        await libraryGenerator(tsSolutionTree, buildableOptions);

        const tsconfigBase = readJson(tsSolutionTree, 'tsconfig.base.json');
        expect(
          tsconfigBase.compilerOptions.paths?.['@e2e/test'],
        ).toBeUndefined();
      });
    });
  });
});
