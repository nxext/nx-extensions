import {
  mkdtempSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Config } from '@stencil/core/compiler';
import { prepareConfigAndOutputargetPaths } from './prepare-config-and-outputarget-paths';
import { PathCollection } from './types';

function makeConfig(
  pathCollection: PathCollection,
  overrides: Partial<Config> = {}
): Config {
  return {
    flags: { e2e: false } as Config['flags'],
    packageJsonFilePath: join(pathCollection.projectRoot, 'package.json'),
    ...overrides,
  } as Config;
}

describe('prepareConfigAndOutputargetPaths', () => {
  let projectRoot: string;
  let pathCollection: PathCollection;

  beforeEach(() => {
    projectRoot = mkdtempSync(join(tmpdir(), 'stencil-prepare-paths-'));
    pathCollection = {
      projectName: 'my-lib',
      projectRoot,
      distDir: join(projectRoot, 'dist'),
      pkgJson: join(projectRoot, 'package.json'),
    };
  });

  afterEach(() => {
    rmSync(projectRoot, { recursive: true, force: true });
  });

  it('creates the dist dir when it does not exist yet', async () => {
    expect(existsSync(pathCollection.distDir)).toBe(false);

    await prepareConfigAndOutputargetPaths(
      makeConfig(pathCollection),
      pathCollection
    );

    expect(existsSync(pathCollection.distDir)).toBe(true);
  });

  it('scaffolds a synthetic dist package.json when the project has none', async () => {
    await prepareConfigAndOutputargetPaths(
      makeConfig(pathCollection),
      pathCollection
    );

    const distPkgPath = join(pathCollection.distDir, 'package.json');
    expect(existsSync(distPkgPath)).toBe(true);

    const distPkg = JSON.parse(readFileSync(distPkgPath, 'utf-8'));
    expect(distPkg.name).toBe('my-lib');
    expect(distPkg.main).toBe('./dist/index.cjs.js');
  });

  it('copies the real package.json into the dist dir when one exists at the project root', async () => {
    writeFileSync(
      pathCollection.pkgJson,
      JSON.stringify({ name: 'my-lib', version: '1.2.3' })
    );

    await prepareConfigAndOutputargetPaths(
      makeConfig(pathCollection),
      pathCollection
    );

    const copiedPkgPath = join(pathCollection.distDir, 'package.json');
    expect(existsSync(copiedPkgPath)).toBe(true);
    expect(JSON.parse(readFileSync(copiedPkgPath, 'utf-8')).version).toBe(
      '1.2.3'
    );
  });

  it('for a non-e2e build, rewrites packageJsonFilePath from the project root to the dist dir', async () => {
    const config = makeConfig(pathCollection, {
      flags: { e2e: false } as Config['flags'],
    });

    const result = await prepareConfigAndOutputargetPaths(
      config,
      pathCollection
    );

    expect(result.packageJsonFilePath).toBe(
      join(pathCollection.distDir, 'package.json')
    );
  });

  it('for an e2e run, stages package.e2e.json and points packageJsonFilePath at it', async () => {
    const config = makeConfig(pathCollection, {
      flags: { e2e: true } as Config['flags'],
    });

    const result = await prepareConfigAndOutputargetPaths(
      config,
      pathCollection
    );

    expect(
      existsSync(join(pathCollection.projectRoot, 'package.e2e.json'))
    ).toBe(true);
    expect(result.packageJsonFilePath).toBe(
      join(pathCollection.projectRoot, 'package.e2e.json')
    );
  });
});
