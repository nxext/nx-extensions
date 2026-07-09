import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodesV2 } from './plugin';

describe('@nxext/capacitor/plugin', () => {
  let workspaceRoot: string;

  beforeEach(() => {
    workspaceRoot = mkdtempSync(join(tmpdir(), 'nxext-capacitor-plugin-'));
  });

  afterEach(() => {
    rmSync(workspaceRoot, { recursive: true, force: true });
  });

  it('infers cap targets for a project with capacitor.config.ts', async () => {
    const projectRoot = 'apps/my-capacitor-app';
    scaffoldCapacitorProject(workspaceRoot, projectRoot);

    const [_pattern, createNodesFn] = createNodesV2;
    const results = await createNodesFn(
      [`${projectRoot}/capacitor.config.ts`],
      {},
      fakeContext(workspaceRoot),
    );

    expect(results).toHaveLength(1);
    const [configFile, result] = results[0];

    // The first tuple element must be the config file path, not the project root.
    expect(configFile).toEqual(`${projectRoot}/capacitor.config.ts`);

    const project = result.projects[projectRoot];
    expect(project.projectType).toEqual('application');

    const targets = project.targets;
    expect(targets.cap).toMatchObject({
      command: 'cap --help',
      cache: false,
      options: { cwd: projectRoot },
    });

    expect(targets.sync).toMatchObject({
      command: 'cap sync',
      cache: false,
      options: { cwd: projectRoot },
    });
    expect(targets.sync.configurations).toEqual({
      ios: { command: 'cap sync ios' },
      android: { command: 'cap sync android' },
    });

    for (const command of ['add', 'copy', 'open', 'run', 'sync', 'update']) {
      expect(targets[command]).toBeDefined();
      expect(targets[command].configurations.ios.command).toEqual(
        `cap ${command} ios`,
      );
      expect(targets[command].configurations.android.command).toEqual(
        `cap ${command} android`,
      );
    }
  });

  it('creates a node when only package.json is present (no project.json)', async () => {
    const projectRoot = 'apps/package-json-only';
    mkdirSync(join(workspaceRoot, projectRoot), { recursive: true });
    writeFileSync(
      join(workspaceRoot, projectRoot, 'capacitor.config.ts'),
      'export const config = {};',
    );
    writeFileSync(
      join(workspaceRoot, projectRoot, 'package.json'),
      JSON.stringify({ name: 'package-json-only' }),
    );

    const [, createNodesFn] = createNodesV2;
    const results = await createNodesFn(
      [`${projectRoot}/capacitor.config.ts`],
      {},
      fakeContext(workspaceRoot),
    );

    expect(results).toHaveLength(1);
    const [, result] = results[0];
    expect(result.projects[projectRoot]).toBeDefined();
  });

  it('skips config files that live outside of a project (no project.json / package.json next to them)', async () => {
    const orphanRoot = 'misc/snippets';
    mkdirSync(join(workspaceRoot, orphanRoot), { recursive: true });
    writeFileSync(
      join(workspaceRoot, orphanRoot, 'capacitor.config.ts'),
      'export const config = {};',
    );

    const [, createNodesFn] = createNodesV2;
    const results = await createNodesFn(
      [`${orphanRoot}/capacitor.config.ts`],
      {},
      fakeContext(workspaceRoot),
    );

    expect(results).toEqual([]);
  });
});

function scaffoldCapacitorProject(workspaceRoot: string, projectRoot: string) {
  mkdirSync(join(workspaceRoot, projectRoot), { recursive: true });
  writeFileSync(
    join(workspaceRoot, projectRoot, 'capacitor.config.ts'),
    'export const config = {};',
  );
  writeFileSync(
    join(workspaceRoot, projectRoot, 'project.json'),
    JSON.stringify({ name: projectRoot.split('/').pop(), root: projectRoot }),
  );
}

function fakeContext(workspaceRoot: string) {
  return {
    workspaceRoot,
    nxJsonConfiguration: {},
    configFiles: [],
  };
}
