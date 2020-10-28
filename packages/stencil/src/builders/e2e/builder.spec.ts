import { Architect, BuilderOutput } from '@angular-devkit/architect';
import { ProjectType } from '@nrwl/workspace';
import { mockContext } from '../../utils/testing';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

describe('Command Runner Test', () => {
  let architect: Architect;

  beforeEach(async () => {
    [architect] = await mockContext();
    jest.mock('../stencil-runtime', () => ({
      createStencilProcess: jest.fn(() => function (source: Observable<any>): Observable<BuilderOutput> {
        return source.pipe(switchMap(() => of({ success: true })));
      }),
      createStencilConfig: jest.fn(() => of({}))
    }))
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
