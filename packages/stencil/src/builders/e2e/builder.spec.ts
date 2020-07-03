import { Architect, BuilderOutput } from '@angular-devkit/architect';
import { ProjectType } from '@nrwl/workspace';
import { mockContext } from '../../utils/testing';
import * as stencilUtils from '../utils';
import { Observable, of } from 'rxjs';
import { Config } from '@stencil/core/cli';
import { switchMap } from 'rxjs/operators';

describe('Command Runner Test', () => {
  let architect: Architect;

  beforeEach(async () => {
    [architect] = await mockContext();
    jest
      .spyOn(stencilUtils, 'createStencilConfig')
      .mockImplementation(() => of({}));
    jest.spyOn(stencilUtils, 'createStencilProcess').mockImplementation(
      () =>
        function (source: Observable<Config>): Observable<BuilderOutput> {
          return source.pipe(switchMap(() => of({ success: true })));
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
