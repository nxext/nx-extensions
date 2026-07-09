import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { addCypressApplication } from './add-cypress';

describe('addCypressApplication', () => {
  let tree: Tree;
  const baseOptions = {
    projectName: 'my-app',
    e2eTestRunner: 'cypress' as const,
    e2eProjectName: 'my-app-e2e',
    e2eProjectRoot: 'apps/my-app-e2e',
    e2eWebServerAddress: 'http://localhost:4200',
    e2eWebServerTarget: 'serve',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'my-app', {
      root: 'apps/my-app',
      sourceRoot: 'apps/my-app/src',
      projectType: 'application',
      targets: {
        build: {
          executor: '@nx/vite:build',
          options: { outputPath: 'dist/apps/my-app' },
        },
      },
    });
  });

  it('is a no-op when e2eTestRunner is not cypress', async () => {
    const task = await addCypressApplication(tree, {
      ...baseOptions,
      e2eTestRunner: 'none',
    });

    expect(typeof task).toBe('function');
    expect(tree.exists('apps/my-app-e2e')).toBeFalsy();
  });

  it('adds a serve-static target on the app and creates the e2e project (rootProject undefined -> preact-style)', async () => {
    await addCypressApplication(tree, baseOptions);

    const appConfig = readProjectConfiguration(tree, 'my-app');
    expect(appConfig.targets['serve-static']).toBeDefined();

    const e2eConfig = readProjectConfiguration(tree, 'my-app-e2e');
    expect(e2eConfig.root).toBe('apps/my-app-e2e');
    expect(e2eConfig.implicitDependencies).toEqual(['my-app']);
    expect(e2eConfig.projectType).toBe('application');
  });

  it('wires devServerTarget/baseUrl/webServerCommands from the passed-in fields', async () => {
    await addCypressApplication(tree, baseOptions);

    const e2eConfig = readProjectConfiguration(tree, 'my-app-e2e');
    expect(e2eConfig.targets.e2e.options.devServerTarget).toBe('my-app:serve');
    expect(e2eConfig.targets.e2e.configurations.ci.devServerTarget).toBe(
      'my-app:serve-static',
    );

    const cypressConfig = tree.read(
      'apps/my-app-e2e/cypress.config.ts',
      'utf-8',
    );
    expect(cypressConfig).toContain('http://localhost:4200');
  });

  it('passes rootProject through to the underlying cypress configurationGenerator without forcing a value', async () => {
    await addCypressApplication(tree, { ...baseOptions, rootProject: true });

    // no throw, and the e2e project still gets created with the given root
    const e2eConfig = readProjectConfiguration(tree, 'my-app-e2e');
    expect(e2eConfig.root).toBe('apps/my-app-e2e');
  });
});
