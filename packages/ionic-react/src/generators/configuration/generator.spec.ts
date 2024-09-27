import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { configurationGenerator } from './generator';
import { ConfigurationGeneratorSchema } from './schema';

describe('application', () => {
  let host: Tree;

  const options: ConfigurationGeneratorSchema = {
    project: 'my-app',
    capacitor: false,
    skipFormat: true,
  };

  const projectRoot = `apps/${options.project}`;

  function testGeneratedFiles(
    tree: Tree,
    options: ConfigurationGeneratorSchema
  ) {
    // Common files
    expect(tree.exists(`${projectRoot}/src/index.html`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/manifest.json`)).toBeTruthy();
    expect(tree.exists(`${projectRoot}/src/public/favicon.png`)).toBeTruthy();

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
    await configurationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/react']).toBeDefined();
    expect(packageJson.dependencies['@ionic/react-router']).toBeDefined();
    expect(packageJson.devDependencies['@nx/react']).toBeDefined();
  });

  it('should generate application', async () => {
    await configurationGenerator(host, options);

    testGeneratedFiles(host, { ...options });
  });

  it('should delete unused @nx/react files', async () => {
    await configurationGenerator(host, options);

    expect(host.exists(`${projectRoot}/src/app/app.css`)).toBeFalsy();
    expect(host.exists(`${projectRoot}/public/favicon.ico`)).toBeFalsy();
    expect(host.exists(`${projectRoot}/src/favicon.ico`)).toBeFalsy();
  });

  it('should update assets in project configuration', async () => {
    await configurationGenerator(host, options);
    const project = readProjectConfiguration(host, options.project);

    expect(project.targets.build.options.assets).not.toContain(
      `${projectRoot}/src/favicon.ico`
    );
    expect(project.targets.build.options.assets).toContain(
      `${projectRoot}/src/manifest.json`
    );
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        await configurationGenerator(host, { ...options, capacitor: true });

        testGeneratedFiles(host, { ...options, capacitor: true });
      });
    });
  });
});
