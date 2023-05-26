import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from './generator';
import { ApplicationGeneratorSchema } from './schema';

describe('application', () => {
  let host: Tree;

  const options: ApplicationGeneratorSchema = {
    name: 'my-app',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    template: 'blank',
    capacitor: false,
    skipFormat: true,
  };

  const projectRoot = `apps/${options.name}`;

  function testGeneratedFiles(tree: Tree, options: ApplicationGeneratorSchema) {
    // Common files
    expect(tree.exists(`${projectRoot}/.eslintrc.json`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/index.html`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/manifest.json`)).toBeTruthy();
    expect(
      tree.exists(`${projectRoot}/src/assets/icon/favicon.png`)
    ).toBeTruthy();

    // Starter templates
    expect(tree.exists(`${projectRoot}/src/App.tsx`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/pages/Home.tsx`)).toBeTruthy();
    expect(
      tree.exists(`${projectRoot}/src/components/ExploreContainer.tsx`)
    ).toBeTruthy();

    expect(
      tree.exists(`${projectRoot}/src/components/ExploreContainer.css`)
    ).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/pages/Home.css`)).toBeTruthy();

    // Capacitor files
    if (options.capacitor) {
      expect(tree.exists(`${projectRoot}/capacitor.config.ts`)).toBeTruthy();
    }
  }

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add dependencies to package.json', async () => {
    await applicationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/react']).toBeDefined();
    expect(packageJson.dependencies['@ionic/react-router']).toBeDefined();
    expect(packageJson.devDependencies['@nx/react']).toBeDefined();
  });

  it('should generate application', async () => {
    await applicationGenerator(host, options);

    testGeneratedFiles(host, { ...options });
  });

  it('should delete unused @nx/react files', async () => {
    await applicationGenerator(host, options);

    expect(host.exists(`${projectRoot}/src/app/app.css`)).toBeFalsy();
    expect(host.exists(`${projectRoot}/src/favicon.ico`)).toBeFalsy();
  });

  it('should update assets in project configuration', async () => {
    await applicationGenerator(host, options);
    const project = readProjectConfiguration(host, options.name);

    expect(project.targets.build.options.assets).not.toContain(
      `${projectRoot}/src/favicon.ico`
    );
    expect(project.targets.build.options.assets).toContain(
      `${projectRoot}/src/manifest.json`
    );
  });

  describe('--template', () => {
    it('should add base template files', async () => {
      await applicationGenerator(host, options);

      expect(host.exists(`${projectRoot}/ionic.config.json`)).toBeTruthy();
      expect(
        host.exists(`${projectRoot}/src/theme/variables.css`)
      ).toBeTruthy();
    });

    it('should add blank template files', async () => {
      await applicationGenerator(host, { ...options, template: 'blank' });

      expect(
        host.exists(`${projectRoot}/src/components/ExploreContainer.tsx`)
      ).toBeTruthy();
    });

    it('should add list template files', async () => {
      await applicationGenerator(host, { ...options, template: 'list' });

      expect(
        host.exists(`${projectRoot}/src/pages/ViewMessage.tsx`)
      ).toBeTruthy();
    });

    it('should add sidemenu template files', async () => {
      await applicationGenerator(host, { ...options, template: 'sidemenu' });

      expect(host.exists(`${projectRoot}/src/pages/Page.tsx`)).toBeTruthy();
    });

    it('should add tabs template files', async () => {
      await applicationGenerator(host, { ...options, template: 'tabs' });

      expect(host.exists(`${projectRoot}/src/pages/Tab1.tsx`)).toBeTruthy();
    });
  });

  describe('--directory', () => {
    it('should update project configuration with directory', async () => {
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

      expect(host.exists(`${projectRoot}/src/app/App.spec.tsx`)).toBeFalsy();
    });
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        await applicationGenerator(host, { ...options, capacitor: true });

        testGeneratedFiles(host, { ...options, capacitor: true });
      });
    });
  });

  describe('--standaloneConfig', () => {
    describe('true', () => {
      it('should generate package.json', async () => {
        await applicationGenerator(host, {
          ...options,
          standaloneConfig: true,
        });

        expect(host.exists(`${projectRoot}/package.json`)).toBeDefined();
      });
    });

    describe('false', () => {
      it('should not generate package.json', async () => {
        await applicationGenerator(host, {
          ...options,
          standaloneConfig: false,
        });

        expect(host.exists(`${projectRoot}/package.json`)).toBeFalsy();
      });
    });
  });
});
