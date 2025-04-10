import { SveltekitExecutorOptions } from './schema';
import executor from './executor';
import { ExecutorContext } from '@nx/devkit';

const options: SveltekitExecutorOptions = {
  command: 'build',
  name: 'sveltekit-example',
};

describe('Sveltekit Executor', () => {
  let context: Pick<
    ExecutorContext,
    | 'root'
    | 'cwd'
    | 'projectsConfigurations'
    | 'isVerbose'
    | 'projectName'
    | 'targetName'
  >;

  beforeEach(async () => {
    const projectName = 'example';
    context = {
      root: '/root',
      cwd: '/root',
      projectsConfigurations: {
        version: 2,
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
    const output = await executor(options, context as ExecutorContext);
    expect(output.success).toBe(true);
  });
});
