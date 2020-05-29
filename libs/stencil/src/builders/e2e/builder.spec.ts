import { Architect, BuilderOutput } from '@angular-devkit/architect';
import { ProjectType } from '@nrwl/workspace';
import { MockBuilderContext } from '@nrwl/workspace/testing';
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
      '@nxext/stencil:e2e',
      options
    );
    const output = await runned.result;
    await runned.stop();

    expect(output.success).toBe(true);
  });
});
