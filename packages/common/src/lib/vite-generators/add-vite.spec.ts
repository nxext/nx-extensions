import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nx/devkit';
import { addViteApplication, configureViteFrameworkPlugin } from './add-vite';
import { ViteFrameworkConfig } from './types';

describe('addViteApplication', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'my-app', {
      root: 'apps/my-app',
      sourceRoot: 'apps/my-app/src',
      projectType: 'application',
      targets: {},
    });
    // viteConfigurationGenerator (with includeVitest) patches the project's
    // tsconfig.json, so a minimal one needs to already exist — same
    // precondition application.ts's own createFiles() step establishes
    // before calling addVite() in preact/solid/svelte today.
    writeJson(tree, 'apps/my-app/tsconfig.json', {
      compilerOptions: {},
      files: [],
      include: [],
      references: [],
    });
  });

  it('configures vite build/serve/preview targets for the project (uiFramework: none, newProject: true)', async () => {
    await addViteApplication(tree, {
      projectName: 'my-app',
      unitTestRunner: 'jest',
    });

    const { targets } = readProjectConfiguration(tree, 'my-app');
    expect(targets.build.executor).toBe('@nx/vite:build');
    expect(targets.serve.executor).toBe('@nx/vite:dev-server');
    expect(targets.test).toBeUndefined();
  });

  it('adds a vitest test target only when unitTestRunner is vitest', async () => {
    await addViteApplication(tree, {
      projectName: 'my-app',
      unitTestRunner: 'vitest',
    });

    const { targets } = readProjectConfiguration(tree, 'my-app');
    expect(targets.test.executor).toBe('@nx/vitest:test');
  });
});

describe('configureViteFrameworkPlugin', () => {
  let tree: Tree;
  const preactLikeConfig: ViteFrameworkConfig = {
    frameworkName: 'preact',
    plugin: {
      importStatement: `import preact from '@preact/preset-vite'`,
      pluginCallExpression: 'preact()',
    },
  };
  const svelteLikeConfig: ViteFrameworkConfig = {
    frameworkName: 'svelte',
    plugin: {
      importStatement: `import { svelte } from '@sveltejs/vite-plugin-svelte'`,
      pluginCallExpression: 'svelte()',
    },
    extraPlugins: [
      {
        when: ({ includeVitest }) => includeVitest,
        importStatement: `import { svelteTesting } from '@testing-library/svelte/vite'`,
        pluginCallExpression: 'svelteTesting()',
      },
    ],
  };

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'my-app', {
      root: 'apps/my-app',
      sourceRoot: 'apps/my-app/src',
      projectType: 'application',
      targets: {},
    });
    writeJson(tree, 'apps/my-app/tsconfig.json', {
      compilerOptions: {},
      files: [],
      include: [],
      references: [],
    });
    await addViteApplication(tree, {
      projectName: 'my-app',
      unitTestRunner: 'none',
    });
  });

  it('wires the framework plugin import + call expression into vite.config.ts', () => {
    configureViteFrameworkPlugin(
      tree,
      { project: 'my-app', includeLib: false, includeVitest: false },
      preactLikeConfig,
    );

    const viteConfig = tree.read('apps/my-app/vite.config.ts', 'utf-8');
    expect(viteConfig).toContain(`import preact from '@preact/preset-vite'`);
    expect(viteConfig).toContain('preact()');
  });

  it('does not add a conditional extra plugin when its `when` guard is false', () => {
    configureViteFrameworkPlugin(
      tree,
      { project: 'my-app', includeLib: false, includeVitest: false },
      svelteLikeConfig,
    );

    const viteConfig = tree.read('apps/my-app/vite.config.ts', 'utf-8');
    expect(viteConfig).toContain('svelte()');
    expect(viteConfig).not.toContain('svelteTesting()');
  });

  it('adds the conditional extra plugin when its `when` guard is true (svelteTesting under includeVitest)', () => {
    configureViteFrameworkPlugin(
      tree,
      { project: 'my-app', includeLib: false, includeVitest: true },
      svelteLikeConfig,
    );

    const viteConfig = tree.read('apps/my-app/vite.config.ts', 'utf-8');
    expect(viteConfig).toContain('svelte()');
    expect(viteConfig).toContain('svelteTesting()');
    expect(viteConfig).toContain(
      `import { svelteTesting } from '@testing-library/svelte/vite'`,
    );
  });
});
