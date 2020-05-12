import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { ProjectType } from '@nrwl/workspace';
import { MockBuilderContext } from '@nrwl/workspace/testing';
import { ConfigFlags } from '@stencil/core/cli';

jest.mock('@stencil/core/cli', () => ({
  runTask: jest.fn(() => Promise.resolve()),
  parseFlags: jest.fn(() => {
    return {
      ci: false,
    } as ConfigFlags;
  }),
  createNodeLogger: jest.fn(() => {
    return {
      printDiagnostics: jest.fn()
    }
  }),
  createNodeSystem: jest.fn(() => {
    return {
      getCompilerExecutingPath: jest.fn(),
    };
  }),
  run: jest.fn(() => Promise.resolve())
}));
jest.mock('@stencil/core/compiler', () => ({
  loadConfig: jest.fn(() =>
    Promise.resolve({
      config: {
        flags: {
          task: 'build',
        },
      },
    })
  ),
}));

export async function createArchitect() {
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const architectHost = new TestingArchitectHost('/root', '/root');
  const architect = new Architect(architectHost, registry);

  await architectHost.addBuilderFromPackage(join(__dirname, '../../..'));

  return [architect, architectHost] as [Architect, TestingArchitectHost];
}

export async function mockContext() {
  const [architect, architectHost] = await createArchitect();

  const context = new MockBuilderContext(architect, architectHost);
  await context.addBuilderFromPackage(join(__dirname, '../../..'));
  return context;
}

describe('Command Runner Builder', () => {
  let architect: Architect;
  let context: MockBuilderContext;

  beforeEach(async () => {
    [architect] = await createArchitect();
    context = await mockContext();
    context.target.project = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can run', async () => {
    const options = {
      projectType: ProjectType.Application,
    };

    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with dev flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      dev: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with ci flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      ci: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with debug flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      debug: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with docs flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      docs: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with custom port', async () => {
    const options = {
      projectType: ProjectType.Application,
      port: 1234,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with serve flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      serve: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with verbose flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      verbose: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });

  it('can run with watch flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      watch: true,
    };
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });
});
