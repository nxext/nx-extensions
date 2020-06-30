import { Architect, BuilderOutput } from '@angular-devkit/architect';
import { ProjectType } from '@nrwl/workspace';
import { MockBuilderContext } from '@nrwl/workspace/testing';
import { mockContext } from '../../utils/testing';
import * as stencilUtils from '../utils';
import { Observable, of } from 'rxjs';
import { Config } from '@stencil/core/cli';
import { switchMap } from 'rxjs/operators';

describe('Command Runner Build', () => {
  let architect: Architect;
  let context: MockBuilderContext;

  beforeEach(async () => {
    [architect, context] = await mockContext();
    jest
      .spyOn(stencilUtils, 'createStencilConfig')
      .mockImplementation(() => of({}));
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
