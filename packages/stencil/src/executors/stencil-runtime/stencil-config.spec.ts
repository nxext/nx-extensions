import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigFlags } from '@stencil/core/cli';
import { ExecutorContext } from '@nx/devkit';
import { initializeStencilConfig } from './stencil-config';

function makeContext(
  root: string,
  projectName: string,
  projectRoot: string
): ExecutorContext {
  return {
    root,
    projectName,
    cwd: root,
    isVerbose: false,
    projectsConfigurations: {
      version: 2,
      projects: {
        [projectName]: { root: projectRoot },
      },
    },
  } as unknown as ExecutorContext;
}

describe('initializeStencilConfig', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'stencil-init-config-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('resolves the project root via context.projectsConfigurations (not the removed context.workspace API)', async () => {
    writeFileSync(
      join(root, 'stencil.config.ts'),
      `import { Config } from '@stencil/core';\nexport const config: Config = { namespace: 'testlib', outputTargets: [{ type: 'dist' }] };\n`
    );

    const context = makeContext(root, 'my-lib', 'libs/my-lib');
    const flags = { task: 'build' } as ConfigFlags;

    const { pathCollection } = await initializeStencilConfig(
      'build',
      { configPath: 'stencil.config.ts', outputPath: 'dist/libs/my-lib' },
      context,
      flags
    );

    expect(pathCollection.projectName).toBe('my-lib');
    expect(pathCollection.projectRoot).toBe(join(root, 'libs/my-lib'));
    expect(pathCollection.distDir).toBe(join(root, 'dist/libs/my-lib'));
  });

  it('redirects rootDir and packageJsonFilePath to the dist dir for a build task', async () => {
    writeFileSync(
      join(root, 'stencil.config.ts'),
      `import { Config } from '@stencil/core';\nexport const config: Config = { namespace: 'testlib', outputTargets: [{ type: 'dist' }] };\n`
    );

    const context = makeContext(root, 'my-lib', '.');
    const flags = { task: 'build' } as ConfigFlags;

    const { strictConfig } = await initializeStencilConfig(
      'build',
      { configPath: 'stencil.config.ts', outputPath: 'dist/libs/my-lib' },
      context,
      flags
    );

    expect(strictConfig.rootDir).toBe(join(root, 'dist/libs/my-lib'));
    expect(strictConfig.packageJsonFilePath).toBe(
      join(root, 'dist/libs/my-lib', 'package.json')
    );
  });

  it('does not redirect rootDir/packageJsonFilePath to the dist dir for a non-build task (e.g. test)', async () => {
    writeFileSync(
      join(root, 'stencil.config.ts'),
      `import { Config } from '@stencil/core';\nexport const config: Config = { namespace: 'testlib', outputTargets: [{ type: 'dist' }] };\n`
    );

    const context = makeContext(root, 'my-lib', '.');
    const flags = { task: 'test' } as ConfigFlags;
    const distDir = join(root, 'dist/libs/my-lib');

    const { strictConfig } = await initializeStencilConfig(
      'test',
      { configPath: 'stencil.config.ts', outputPath: 'dist/libs/my-lib' },
      context,
      flags
    );

    // The build-only redirect (see the previous test) must not fire here.
    expect(strictConfig.rootDir).not.toBe(distDir);
    expect(strictConfig.packageJsonFilePath).not.toBe(
      join(distDir, 'package.json')
    );
  });

  it('defaults outputTargets/testing/rootDir when Stencil fails to load a config (loadedConfig undefined)', async () => {
    // Missing `namespace` makes @stencil/core's own loadConfig() report a
    // build error and return `config: null` — the exact shape the
    // `strictConfig` defaulting guards against (see d3357f9c).
    writeFileSync(
      join(root, 'stencil.config.ts'),
      `import { Config } from '@stencil/core';\nexport const config: Config = { outputTargets: [{ type: 'dist' }] };\n`
    );

    const context = makeContext(root, 'my-lib', '.');
    const flags = { task: 'build' } as ConfigFlags;

    const { strictConfig } = await initializeStencilConfig(
      'build',
      { configPath: 'stencil.config.ts', outputPath: 'dist/libs/my-lib' },
      context,
      flags
    );

    expect(strictConfig.outputTargets).toEqual([]);
    expect(strictConfig.testing).toEqual({});
    expect(strictConfig.flags).toBe(flags);
  });
});
