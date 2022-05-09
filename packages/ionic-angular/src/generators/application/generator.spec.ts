import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from './generator';
import { ApplicationGeneratorSchema } from './schema';

describe('application schematic', () => {
  let appTree: Tree;
  const options: ApplicationGeneratorSchema = {
    name: 'my-app',
    template: 'blank',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    capacitor: false,
    skipFormat: false,
  };
  const projectRoot = `apps/${options.name}`;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add dependencies to package.json', async () => {
    await applicationGenerator(appTree, options);

    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.dependencies['@ionic/angular']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/angular']).toBeDefined();
    expect(packageJson.devDependencies['@nxext/capacitor']).toBeDefined();
  });

  it('should update assets in project configuration', async () => {
    await applicationGenerator(appTree, options);
    const project = readProjectConfiguration(appTree, options.name);

    const assets = project.targets.build.options.assets;
    const styles = project.targets.build.options.styles;

    expect(assets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          input: 'node_modules/ionicons/dist/ionicons/svg',
        }),
      ])
    );
    expect(assets).not.toContain(`${projectRoot}/src/favicon.ico`);

    expect(styles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          input: `${projectRoot}/src/theme/variables.scss`,
        }),
      ])
    );
  });

  describe('--linter', () => {
    it('should update .eslintrc.json', async () => {
      await applicationGenerator(appTree, options);

      const eslintrcJson = readJson(
        appTree,
        `apps/${options.name}/.eslintrc.json`
      );
      const tsOverride = eslintrcJson.overrides.find(
        (override: { files: string | string[] }) =>
          override.files.includes('*.ts')
      );

      expect(
        tsOverride.rules['@angular-eslint/component-class-suffix']
      ).toEqual([
        'error',
        {
          suffixes: ['Page', 'Component'],
        },
      ]);
      expect(
        tsOverride.rules['@angular-eslint/no-empty-lifecycle-method']
      ).toEqual(0);
      expect(tsOverride.rules['@typescript-eslint/no-empty-function']).toEqual(
        0
      );
    });
  });

  describe('--template', () => {
    it('should add base template files', async () => {
      await applicationGenerator(appTree, options);

      expect(appTree.exists(`${projectRoot}/ionic.config.json`)).toBeTruthy();

      expect(appTree.exists(`${projectRoot}/src/favicon.ico`)).toBeFalsy();
      expect(
        appTree.exists(`${projectRoot}/src/assets/shapes.svg`)
      ).toBeTruthy();
      expect(
        appTree.exists(`${projectRoot}/src/assets/icon/favicon.png`)
      ).toBeTruthy();

      expect(
        appTree.exists(`${projectRoot}/src/theme/variables.scss`)
      ).toBeTruthy();

      expect(
        appTree.exists(`${projectRoot}/src/app/app.module.ts`)
      ).toBeTruthy();
    });

    it('--blank', async () => {
      await applicationGenerator(appTree, { ...options, template: 'blank' });

      expect(
        appTree.exists(`${projectRoot}/src/app/home/home.module.ts`)
      ).toBeTruthy();
    });

    it('--list', async () => {
      await applicationGenerator(appTree, { ...options, template: 'list' });

      expect(
        appTree.exists(
          `${projectRoot}/src/app/view-message/view-message.module.ts`
        )
      ).toBeTruthy();
    });

    it('--sidemenu', async () => {
      await applicationGenerator(appTree, { ...options, template: 'sidemenu' });

      expect(
        appTree.exists(`${projectRoot}/src/app/folder/folder.module.ts`)
      ).toBeTruthy();
    });

    it('--tabs', async () => {
      await applicationGenerator(appTree, { ...options, template: 'tabs' });

      expect(
        appTree.exists(`${projectRoot}/src/app/tabs/tabs.module.ts`)
      ).toBeTruthy();
    });
  });

  describe('--directory', () => {
    it('should update workspace.json', async () => {
      await applicationGenerator(appTree, { ...options, directory: 'myDir' });
      const project = readProjectConfiguration(
        appTree,
        `my-dir-${options.name}`
      );
      const projectE2e = readProjectConfiguration(
        appTree,
        `my-dir-${options.name}-e2e`
      );

      expect(project.root).toEqual('apps/my-dir/my-app');
      expect(projectE2e.root).toEqual('apps/my-dir/my-app-e2e');
    });

    it('should generate files', async () => {
      await applicationGenerator(appTree, { ...options, directory: 'myDir' });

      expect(appTree.exists('apps/my-dir/my-app/src/main.ts'));
    });

    it('should generate Capacitor project', async () => {
      await applicationGenerator(appTree, {
        ...options,
        directory: 'my-dir',
        capacitor: true,
      });

      expect(
        appTree.exists(`apps/my-dir/my-app/capacitor.config.ts`)
      ).toBeDefined();
    });
  });

  describe('--unitTestRunner', () => {
    it('none', async () => {
      await applicationGenerator(appTree, {
        ...options,
        unitTestRunner: 'none',
      });

      expect(appTree.read(`package.json`).includes('jest')).toBeFalsy();
      expect(appTree.read(`package.json`).includes('karma')).toBeFalsy();
      expect(
        appTree.exists(`${projectRoot}/src/app/home/home.page.spec.ts`)
      ).toBeFalsy();
    });

    it('jest', async () => {
      await applicationGenerator(appTree, {
        ...options,
        unitTestRunner: 'jest',
      });

      expect(appTree.read(`package.json`).includes('jest')).toBeTruthy();
      expect(appTree.read(`package.json`).includes('karma')).toBeFalsy();
    });

    it('karma', async () => {
      await applicationGenerator(appTree, {
        ...options,
        unitTestRunner: 'karma',
      });

      expect(appTree.read(`package.json`).includes('karma')).toBeTruthy();
    });
  });

  describe('--tags', () => {
    it('should update nx.json', async () => {
      await applicationGenerator(appTree, { ...options, tags: 'one,two' });

      const projectConfiguration = readProjectConfiguration(
        appTree,
        options.name
      );
      expect(projectConfiguration.tags).toEqual(['one', 'two']);
    });
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        await applicationGenerator(appTree, { ...options, capacitor: true });

        expect(
          appTree.exists(`${projectRoot}/capacitor.config.ts`)
        ).toBeDefined();
      });
    });
  });

  describe('--standaloneConfig', () => {
    describe('true', () => {
      it('should generate package.json', async () => {
        appTree = createTreeWithEmptyWorkspace(2);
        await applicationGenerator(appTree, {
          ...options,
          standaloneConfig: true,
        });

        expect(appTree.exists(`${projectRoot}/project.json`)).toBeDefined();
      });
    });

    describe('false', () => {
      it('should not generate package.json', async () => {
        appTree = createTreeWithEmptyWorkspace(2);
        await applicationGenerator(appTree, {
          ...options,
          standaloneConfig: false,
        });

        expect(appTree.exists(`${projectRoot}/project.json`)).toBeFalsy();
      });
    });
  });
});
