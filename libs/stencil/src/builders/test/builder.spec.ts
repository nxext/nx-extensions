import { Architect, BuilderOutput } from '@angular-devkit/architect';
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
      printDiagnostics: jest.fn(),
    };
  }),
  createNodeSystem: jest.fn(() => {
    return {
      getCompilerExecutingPath: jest.fn(),
    };
  }),
  run: jest.fn(() => Promise.resolve()),
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
jest.mock('fs', () => ({
  accessSync: jest.fn(() => {
    return true;
  }),
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
import { mockContext } from '../../utils/testing';
import * as stencilUtils from '../utils';
import { Observable, of } from 'rxjs';
import { Config } from '@stencil/core/cli';
import { switchMap } from 'rxjs/operators';

describe('Command Runner Test', () => {
  let architect: Architect;
  let context: MockBuilderContext;

  beforeEach(async () => {
    [architect, context] = await mockContext();
    jest
      .spyOn(stencilUtils, 'createStencilConfig')
      .mockImplementation(
        (taskCommand, options, context, createStencilCompilerOptions) => of({})
      );
    jest.spyOn(stencilUtils, 'createStencilProcess').mockImplementation(
      () =>
        function (source: Observable<Config>): Observable<BuilderOutput> {
          return source.pipe(switchMap((config) => of({ success: true })));
        }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can run', async () => {
    const options = {
      projectType: ProjectType.Application,
    };

    const runned = await architect.scheduleBuilder(
      '@nxext/stencil:test',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });
});
