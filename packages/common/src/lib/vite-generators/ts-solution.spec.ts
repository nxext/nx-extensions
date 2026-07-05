import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree, updateJson, writeJson } from '@nx/devkit';
import {
  addProjectPackageJson,
  isUsingTsSolutionSetup,
  isUsingTypeScriptPlugin,
  maybeAddTsConfigPath,
  wireTsSolutionProject,
} from './ts-solution';
import { createTsSolutionTree } from './testing';

describe('isUsingTsSolutionSetup (re-export)', () => {
  it('is false for a plain legacy tree and true for createTsSolutionTree()', () => {
    const legacyTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    expect(isUsingTsSolutionSetup(legacyTree)).toBe(false);
    expect(isUsingTsSolutionSetup(createTsSolutionTree())).toBe(true);
  });
});

describe('isUsingTypeScriptPlugin', () => {
  it('is false when nx.json has no plugins entry', () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    expect(isUsingTypeScriptPlugin(tree)).toBe(false);
  });

  it('is true when nx.json.plugins contains the "@nx/js/typescript" string form', () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(tree, 'nx.json', (json) => {
      json.plugins = ['@nx/js/typescript'];
      return json;
    });
    expect(isUsingTypeScriptPlugin(tree)).toBe(true);
  });

  it('is true when nx.json.plugins contains the object form { plugin: "@nx/js/typescript" }', () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(tree, 'nx.json', (json) => {
      json.plugins = [{ plugin: '@nx/js/typescript', options: {} }];
      return json;
    });
    expect(isUsingTypeScriptPlugin(tree)).toBe(true);
  });

  it('is false when plugins are set but do not include "@nx/js/typescript"', () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(tree, 'nx.json', (json) => {
      json.plugins = ['@nx/eslint/plugin'];
      return json;
    });
    expect(isUsingTypeScriptPlugin(tree)).toBe(false);
  });
});

describe('wireTsSolutionProject', () => {
  let legacyTree: Tree;

  beforeEach(() => {
    legacyTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('is a no-op in legacy mode (updateTsconfigFiles self-guards; addProjectToTsSolutionWorkspace is guarded by us)', async () => {
    writeJson(legacyTree, 'apps/my-app/tsconfig.app.json', {
      compilerOptions: {},
    });
    const before = legacyTree.read('apps/my-app/tsconfig.app.json', 'utf-8');

    await wireTsSolutionProject(
      legacyTree,
      'apps/my-app',
      'tsconfig.app.json',
      {
        jsx: 'preserve',
      },
    );

    expect(legacyTree.exists('pnpm-workspace.yaml')).toBe(false);
    expect(legacyTree.read('apps/my-app/tsconfig.app.json', 'utf-8')).toBe(
      before,
    );
  });

  it('registers the project in pnpm-workspace.yaml and wires tsconfig references in TS-solution mode', async () => {
    const tree = createTsSolutionTree();
    writeJson(tree, 'apps/my-app/package.json', { name: '@proj/my-app' });
    writeJson(tree, 'apps/my-app/tsconfig.app.json', { compilerOptions: {} });

    await wireTsSolutionProject(tree, 'apps/my-app', 'tsconfig.app.json', {
      jsx: 'preserve',
    });

    // addProjectToTsSolutionWorkspace (Design 1.2): registered via
    // pnpm-workspace.yaml.packages[], either as literal path or as a
    // collision-free directory glob.
    const workspaceYaml = tree.read('pnpm-workspace.yaml', 'utf-8');
    expect(workspaceYaml).toContain('apps');

    // updateTsconfigFiles (Design 1.3): root tsconfig.json.references[]
    // gets an entry pointing at the project.
    const rootTsconfig = readJson(tree, 'tsconfig.json');
    expect(rootTsconfig.references).toEqual(
      expect.arrayContaining([{ path: './apps/my-app' }]),
    );

    // Runtime tsconfig now extends tsconfig.base.json directly and carries
    // the passed-in compilerOptions override.
    const appTsconfig = readJson(tree, 'apps/my-app/tsconfig.app.json');
    expect(appTsconfig.extends).toBe('../../tsconfig.base.json');
    expect(appTsconfig.compilerOptions.jsx).toBe('preserve');
  });
});

describe('addProjectPackageJson', () => {
  let legacyTree: Tree;

  beforeEach(() => {
    legacyTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('legacy + useProjectJson: writes project.json via addProjectConfiguration, no package.json', () => {
    addProjectPackageJson(legacyTree, {
      projectName: 'my-lib',
      projectRoot: 'libs/my-lib',
      importPath: '@proj/my-lib',
      isUsingTsSolutionConfig: false,
      useProjectJson: true,
      projectType: 'library',
      parsedTags: ['a'],
    });

    expect(legacyTree.exists('libs/my-lib/project.json')).toBe(true);
    const projectJson = readJson(legacyTree, 'libs/my-lib/project.json');
    expect(projectJson.tags).toEqual(['a']);
    expect(legacyTree.exists('libs/my-lib/package.json')).toBe(false);
  });

  it('legacy + !useProjectJson: no project.json, package.json carries nx.name/nx.tags', () => {
    addProjectPackageJson(legacyTree, {
      projectName: 'my-lib',
      projectRoot: 'libs/my-lib',
      importPath: '@proj/my-lib',
      isUsingTsSolutionConfig: false,
      useProjectJson: false,
      projectType: 'library',
      parsedTags: ['a', 'b'],
    });

    expect(legacyTree.exists('libs/my-lib/project.json')).toBe(false);
    const packageJson = readJson(legacyTree, 'libs/my-lib/package.json');
    expect(packageJson.name).toBe('@proj/my-lib');
    expect(packageJson.nx).toEqual({ name: 'my-lib', tags: ['a', 'b'] });
  });

  it('ts-solution + useProjectJson: writes BOTH project.json AND package.json (Nx writes package.json whenever isUsingTsSolutionConfig, regardless of useProjectJson)', () => {
    const tree = createTsSolutionTree();

    addProjectPackageJson(tree, {
      projectName: 'my-lib',
      projectRoot: 'packages/my-lib',
      importPath: '@proj/my-lib',
      isUsingTsSolutionConfig: true,
      useProjectJson: true,
      projectType: 'library',
    });

    expect(tree.exists('packages/my-lib/project.json')).toBe(true);
    expect(tree.exists('packages/my-lib/package.json')).toBe(true);
    const packageJson = readJson(tree, 'packages/my-lib/package.json');
    expect(packageJson.name).toBe('@proj/my-lib');
    // useProjectJson true => no nx field added to package.json
    expect(packageJson.nx).toBeUndefined();
  });

  it('ts-solution + !useProjectJson: no project.json, package.json name=importPath (+ nx field only if projectName differs)', () => {
    const tree = createTsSolutionTree();

    addProjectPackageJson(tree, {
      projectName: '@proj/my-lib',
      projectRoot: 'packages/my-lib',
      importPath: '@proj/my-lib',
      isUsingTsSolutionConfig: true,
      useProjectJson: false,
      projectType: 'library',
      parsedTags: ['x'],
    });

    expect(tree.exists('packages/my-lib/project.json')).toBe(false);
    const packageJson = readJson(tree, 'packages/my-lib/package.json');
    expect(packageJson.name).toBe('@proj/my-lib');
    // projectName === importPath here => no nx.name, but tags still apply.
    expect(packageJson.nx).toEqual({ tags: ['x'] });
  });

  it('carries optional main/exports/files through to the written package.json', () => {
    const tree = createTsSolutionTree();

    addProjectPackageJson(tree, {
      projectName: 'my-lib',
      projectRoot: 'packages/my-lib',
      importPath: '@proj/my-lib',
      isUsingTsSolutionConfig: true,
      useProjectJson: false,
      projectType: 'library',
      main: './src/index.ts',
      exports: { '.': './src/index.ts' },
      files: ['dist'],
    });

    const packageJson = readJson(tree, 'packages/my-lib/package.json');
    expect(packageJson.main).toBe('./src/index.ts');
    expect(packageJson.exports).toEqual({ '.': './src/index.ts' });
    expect(packageJson.files).toEqual(['dist']);
  });
});

describe('maybeAddTsConfigPath', () => {
  it('adds a tsconfig.base.json paths entry in legacy mode', () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    maybeAddTsConfigPath(
      tree,
      '@proj/my-lib',
      ['libs/my-lib/src/index.ts'],
      false,
    );

    const tsconfigBase = readJson(tree, 'tsconfig.base.json');
    expect(tsconfigBase.compilerOptions.paths['@proj/my-lib']).toEqual([
      './libs/my-lib/src/index.ts',
    ]);
  });

  it('is a no-op (Design 1.6) when isUsingTsSolutionConfig is true', () => {
    const tree = createTsSolutionTree();
    const before = tree.read('tsconfig.base.json', 'utf-8');

    maybeAddTsConfigPath(
      tree,
      '@proj/my-lib',
      ['libs/my-lib/src/index.ts'],
      true,
    );

    expect(tree.read('tsconfig.base.json', 'utf-8')).toBe(before);
  });
});
