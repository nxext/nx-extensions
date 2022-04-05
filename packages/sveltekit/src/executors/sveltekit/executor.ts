import { SveltekitExecutorOptions } from './schema';
import {
  ExecutorContext,
  joinPathFragments,
  logger,
  readJsonFile,
} from '@nrwl/devkit';
import { default as runCommands } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { writeToFile } from '@nrwl/workspace/src/utilities/fileutils';

export function extendTsBaseConfig(projectOutput: string, projectRoot: string) {
  const tsExtension = {
    extends: joinPathFragments(projectRoot, 'tsconfig.base.json'),
  };
  const generatedTsConfig = joinPathFragments(projectOutput, 'tsconfig.json');

  const file = {
    ...tsExtension,
    ...readJsonFile(generatedTsConfig),
  };
  writeToFile(generatedTsConfig, JSON.stringify(file));
}

export default async function runExecutor(
  options: SveltekitExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  const portOption = options.command === 'dev' ? ` --port ${options.port}` : '';
  const projectOutput = joinPathFragments(context.root, 'dist/', projectDir);

  const result = await runCommands(
    {
      cwd: projectRoot,
      commands: [
        {
          // creates folder if it doesn't exist
          // otherwhise cp command doesn't work
          command: `mkdir -p ${projectOutput}`,
          description: 'Creating output folder',
        },
        // Copies package.json to dist folder,
        // otherwise sveltekit will look to the closest
        // package.json (parent) and it might cause errors
        // because by default nx does not set it as type : module
        {
          command: 'cp package.json ' + projectOutput,
          description: 'coppying the package.json to dist',
        },
        // svelte-kit on serving, looks to the nearest parent package.json
        {
          command: `svelte-kit ${options.command}${portOption}`,
          description: 'Executing svelte-kit command',
        },
      ],
      parallel: false,
      color: true,
    },
    context
  );

  // Extend generated config to base config
  if (result.success) {
    logger.info('Build executed...');
  } else {
    logger.error('Error while building...');
  }

  return result;
}
