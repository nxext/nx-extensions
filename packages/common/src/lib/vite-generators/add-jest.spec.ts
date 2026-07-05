import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addProjectConfiguration, readJson, Tree, writeJson } from '@nx/devkit';
import { addJestConfiguration } from './add-jest';

describe('addJestConfiguration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'my-app', {
      root: 'apps/my-app',
      sourceRoot: 'apps/my-app/src',
      projectType: 'application',
      targets: {},
    });
    // @nx/jest's configurationGenerator patches the project's tsconfig.json,
    // so a minimal one needs to already exist — same precondition
    // application.ts's own createFiles() step establishes before calling
    // addJest() in preact/solid/svelte today.
    writeJson(tree, 'apps/my-app/tsconfig.json', {
      compilerOptions: {},
      files: [],
      include: [],
      references: [],
    });
  });

  it('is a no-op when unitTestRunner is not jest (mirrors preact/solid/svelte add-jest.ts guard)', async () => {
    const task = await addJestConfiguration(tree, {
      projectName: 'my-app',
      unitTestRunner: 'vitest',
    });

    expect(typeof task).toBe('function');
    expect(tree.exists('apps/my-app/jest.config.cts')).toBeFalsy();
  });

  it('is a no-op when unitTestRunner is none', async () => {
    await addJestConfiguration(tree, {
      projectName: 'my-app',
      unitTestRunner: 'none',
    });

    expect(tree.exists('apps/my-app/jest.config.cts')).toBeFalsy();
  });

  it('configures jest for the project when unitTestRunner is jest', async () => {
    await addJestConfiguration(tree, {
      projectName: 'my-app',
      unitTestRunner: 'jest',
    });

    expect(tree.exists('apps/my-app/jest.config.cts')).toBeTruthy();
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['jest']).toBeDefined();
  });
});
