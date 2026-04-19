import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodesV2 } from './plugin';

describe('@nxext/stencil/plugin', () => {
  let workspaceRoot: string;

  beforeEach(() => {
    workspaceRoot = mkdtempSync(join(tmpdir(), 'nxext-stencil-plugin-'));
  });

  afterEach(() => {
    rmSync(workspaceRoot, { recursive: true, force: true });
  });

  it('infers build/serve/test/e2e for a project with stencil.config.ts', async () => {
    const projectRoot = 'libs/my-stencil-lib';
    scaffoldStencilProject(workspaceRoot, projectRoot);

    const [_pattern, createNodesFn] = createNodesV2;
    const results = await createNodesFn(
      [`${projectRoot}/stencil.config.ts`],
      {},
      fakeContext(workspaceRoot)
    );

    expect(results).toHaveLength(1);
    const [, result] = results[0];
    const project = result.projects[projectRoot];

    expect(project.metadata).toEqual({ technologies: ['stencil'] });

    const targets = project.targets;
    expect(targets.build).toMatchObject({
      command: 'stencil build',
      cache: true,
      inputs: ['default', '^production'],
      options: { cwd: projectRoot },
    });
    expect(targets.build.outputs).toContain(
      `{workspaceRoot}/dist/${projectRoot}`
    );

    expect(targets.serve).toMatchObject({
      command: 'stencil build --dev --watch --serve',
      cache: false,
      options: { cwd: projectRoot },
    });

    expect(targets.test).toMatchObject({
      command: 'stencil test --spec',
      cache: true,
      inputs: ['default', '^production'],
      options: { cwd: projectRoot },
    });

    expect(targets.e2e).toMatchObject({
      command: 'stencil test --e2e',
      cache: false,
      options: { cwd: projectRoot },
    });
  });

  it('skips config files that live outside of a project (no project.json / package.json next to them)', async () => {
    const orphanRoot = 'misc/snippets';
    mkdirSync(join(workspaceRoot, orphanRoot), { recursive: true });
    writeFileSync(
      join(workspaceRoot, orphanRoot, 'stencil.config.ts'),
      'export const config = {};'
    );

    const [, createNodesFn] = createNodesV2;
    const results = await createNodesFn(
      [`${orphanRoot}/stencil.config.ts`],
      {},
      fakeContext(workspaceRoot)
    );

    expect(results).toEqual([]);
  });

  it('honours custom target names passed as plugin options', async () => {
    const projectRoot = 'libs/custom-names';
    scaffoldStencilProject(workspaceRoot, projectRoot);

    const [, createNodesFn] = createNodesV2;
    const results = await createNodesFn(
      [`${projectRoot}/stencil.config.ts`],
      {
        buildTargetName: 'stencil-build',
        serveTargetName: 'stencil-serve',
        testTargetName: 'stencil-test',
        e2eTargetName: 'stencil-e2e',
      },
      fakeContext(workspaceRoot)
    );

    const [, result] = results[0];
    const targets = result.projects[projectRoot].targets;
    expect(Object.keys(targets).sort()).toEqual([
      'stencil-build',
      'stencil-e2e',
      'stencil-serve',
      'stencil-test',
    ]);
  });
});

function scaffoldStencilProject(workspaceRoot: string, projectRoot: string) {
  mkdirSync(join(workspaceRoot, projectRoot), { recursive: true });
  writeFileSync(
    join(workspaceRoot, projectRoot, 'stencil.config.ts'),
    'export const config = {};'
  );
  writeFileSync(
    join(workspaceRoot, projectRoot, 'project.json'),
    JSON.stringify({ name: projectRoot.split('/').pop(), root: projectRoot })
  );
}

function fakeContext(workspaceRoot: string) {
  return {
    workspaceRoot,
    nxJsonConfiguration: {},
    configFiles: [],
  };
}
