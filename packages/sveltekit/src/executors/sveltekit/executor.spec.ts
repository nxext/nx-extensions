import { SveltekitExecutorOptions } from './schema';
import executor from './executor';
import { ExecutorContext } from '@nx/devkit';

const options: SveltekitExecutorOptions = {
  command: 'build',
};

describe('Sveltekit Executor', () => {
  let context: ExecutorContext;

  beforeEach(async () => {
    const projectName = 'example';
    context = {
      root: '/root',
      cwd: '/root',
      workspace: {
        version: 2,
        npmScope: 'proj',
        projects: {
          [projectName]: {
            root: '/',
            targets: {},
          },
        },
      },
      isVerbose: false,
      projectName: projectName,
      targetName: 'build',
    };
  });

  xit('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
