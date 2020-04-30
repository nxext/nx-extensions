import { StencilBuilderOptions } from './schema.d';
import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { ProjectType } from '@nrwl/workspace';
import { MockBuilderContext } from '@nrwl/workspace/testing';
import { ConfigFlags } from '@stencil/core/cli';
import { LoadConfigResults } from '@stencil/core/compiler';

jest.mock('@stencil/core/cli', () => ({
  runTask: jest.fn(() => Promise.resolve()),
  parseFlags: jest.fn(() => {
    return {
      ci: false
    } as ConfigFlags;
  }),
  createNodeLogger: jest.fn(),
  createNodeSystem: jest.fn(() => {
    return {
      getCompilerExecutingPath: jest.fn()
    };
  })
}));
jest.mock('@stencil/core/compiler', () => ({
  loadConfig: jest.fn(() => {
    return {
      config: {
        flags: {
          task: 'build'
        }
      }
    } as LoadConfigResults;
  })
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
  let architectHost: TestingArchitectHost;
  let context: MockBuilderContext;
  let options: StencilBuilderOptions;

  beforeEach(async () => {
    [architect, architectHost] = await createArchitect();
    context = await mockContext();
    context.target.project = 'test';

    options = {
      projectType: ProjectType.Application
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can run', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:build',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });
});
