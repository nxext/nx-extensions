import { StencilBuilderOptions } from './schema.d';
import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { ProjectType } from '@nrwl/workspace';
import { MockBuilderContext } from '@nrwl/workspace/testing';
jest.mock('@stencil/core/cli', () => ({
  run: jest.fn(() => Promise.resolve()),
  createNodeLogger: jest.fn(),
  createNodeSystem: jest.fn(),
}));

export async function createArchitect() {
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const architectHost = new TestingArchitectHost('/root', '/root');
  const architect = new Architect(architectHost, registry);

  // This will either take a Node package name, or a path to the directory
  // for the package.json file.
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
      projectType: ProjectType.Application,
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
    // The "result" member (of type BuilderOutput) is the next output.
    const output = await runned.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await runned.stop();

    // Expect that it succeeded.
    expect(output.success).toBe(true);
  });
});
