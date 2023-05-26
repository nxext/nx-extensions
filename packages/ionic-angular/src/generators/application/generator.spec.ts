import {
  readJson,
  readProjectConfiguration,
  updateJson,
  Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from './generator';
import { ApplicationGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

describe('application schematic', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

  let host: Tree;
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
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add dependencies to package.json', async () => {
    await applicationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/angular']).toBeDefined();
    expect(packageJson.devDependencies['@nx/angular']).toBeDefined();
  });

  it('should update assets in project configuration', async () => {
    await applicationGenerator(host, options);
    const project = readProjectConfiguration(host, options.name);

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
      await applicationGenerator(host, options);

      const eslintrcJson = readJson(
        host,
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
      await applicationGenerator(host, options);

      expect(host.exists(`${projectRoot}/ionic.config.json`)).toBeTruthy();

      expect(host.exists(`${projectRoot}/src/favicon.ico`)).toBeFalsy();
      expect(host.exists(`${projectRoot}/src/assets/shapes.svg`)).toBeTruthy();
      expect(
        host.exists(`${projectRoot}/src/assets/icon/favicon.png`)
      ).toBeTruthy();

      expect(
        host.exists(`${projectRoot}/src/theme/variables.scss`)
      ).toBeTruthy();

      expect(host.exists(`${projectRoot}/src/app/app.module.ts`)).toBeTruthy();
    });

    it('--blank', async () => {
      await applicationGenerator(host, { ...options, template: 'blank' });

      expect(
        host.exists(`${projectRoot}/src/app/home/home.module.ts`)
      ).toBeTruthy();
    });

    it('--list', async () => {
      await applicationGenerator(host, { ...options, template: 'list' });

      expect(
        host.exists(
          `${projectRoot}/src/app/view-message/view-message.module.ts`
        )
      ).toBeTruthy();
    });

    it('--sidemenu', async () => {
      await applicationGenerator(host, { ...options, template: 'sidemenu' });

      expect(
        host.exists(`${projectRoot}/src/app/folder/folder.module.ts`)
      ).toBeTruthy();
    });

    it('--tabs', async () => {
      await applicationGenerator(host, { ...options, template: 'tabs' });

      expect(
        host.exists(`${projectRoot}/src/app/tabs/tabs.module.ts`)
      ).toBeTruthy();
    });
  });

  describe('--directory', () => {
    it('should update workspace.json', async () => {
      await applicationGenerator(host, { ...options, directory: 'myDir' });
      const project = readProjectConfiguration(host, `my-dir-${options.name}`);
      const projectE2e = readProjectConfiguration(
        host,
        `my-dir-${options.name}-e2e`
      );

      expect(project.root).toEqual('apps/my-dir/my-app');
      expect(projectE2e.root).toEqual('apps/my-dir/my-app-e2e');
    });

    it('should generate files', async () => {
      await applicationGenerator(host, { ...options, directory: 'myDir' });

      expect(host.exists('apps/my-dir/my-app/src/main.ts'));
    });

    it('should generate Capacitor project', async () => {
      await applicationGenerator(host, {
        ...options,
        directory: 'my-dir',
        capacitor: true,
      });

      expect(
        host.exists(`apps/my-dir/my-app/capacitor.config.ts`)
      ).toBeDefined();
    });
  });

  describe('--unitTestRunner', () => {
    it('none', async () => {
      await applicationGenerator(host, {
        ...options,
        unitTestRunner: 'none',
      });

      expect(host.read(`package.json`).includes('jest')).toBeFalsy();
      expect(
        host.exists(`${projectRoot}/src/app/home/home.page.spec.ts`)
      ).toBeFalsy();
    });

    it('jest', async () => {
      await applicationGenerator(host, {
        ...options,
        unitTestRunner: 'jest',
      });

      expect(host.read(`package.json`).includes('jest')).toBeTruthy();
    });
  });

  describe('--tags', () => {
    it('should update nx.json', async () => {
      await applicationGenerator(host, { ...options, tags: 'one,two' });

      const projectConfiguration = readProjectConfiguration(host, options.name);
      expect(projectConfiguration.tags).toEqual(['one', 'two']);
    });
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        await applicationGenerator(host, { ...options, capacitor: true });

        expect(host.exists(`${projectRoot}/capacitor.config.ts`)).toBeDefined();
      });
    });
  });
});
