import { Architect, BuilderOutput } from '@angular-devkit/architect';
import { ProjectType } from '@nrwl/workspace';
import { mockContext } from '../../utils/testing';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StencilBuildOptions } from './schema';

describe('Command Runner Build', () => {
  let architect: Architect;

  beforeEach(async () => {
    [architect] = await mockContext();

    jest.mock('../stencil-runtime', () => ({
      createStencilProcess: jest.fn(
        () =>
          function (source: Observable<any>): Observable<BuilderOutput> {
            return source.pipe(switchMap(() => of({ success: true })));
          }
      ),
      createStencilConfig: jest.fn(() => of({})),
    }));
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

  it('can run with prerender flag', async () => {
    const options = {
      projectType: ProjectType.Application,
      prerender: true,
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
