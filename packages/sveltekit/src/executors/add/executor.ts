import {
  ExecutorContext,
  getPackageManagerCommand,
  joinPathFragments,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { sortObjectByKeys } from '@nx/workspace/src/utils/ast-utils';
import { default as runCommands } from 'nx/src/executors/run-commands/run-commands.impl';
import { AddExecutorSchema } from './schema';

export default async function runExecutor(
  options: AddExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const globalPackageJsonPath = joinPathFragments(
    `${context.root}/package.json`
  );
  const globalPackageJson = readJsonFile(globalPackageJsonPath);
  const packageJsonPath = joinPathFragments(`${projectRoot}/package.json`);
  const packageJson = readJsonFile(packageJsonPath);
  const packageJsonOriginal = Object.assign({}, packageJson);

  packageJson.devDependencies = {};
  writeJsonFile(packageJsonPath, packageJson);

  await runCommands(
    {
      command: `npx svelte-add ${options.package}`,
      cwd: projectRoot,
      parallel: false,
      color: true,
      __unparsed__: [],
    },
    context
  );

  const packageJsonAfterRun = readJsonFile(packageJsonPath);
  const devDependencies = packageJsonAfterRun.devDependencies;

  globalPackageJson.devDependencies = {
    ...(globalPackageJson.devDependencies || {}),
    ...devDependencies,
    ...(globalPackageJson.devDependencies || {}),
  };
  globalPackageJson.devDependencies = sortObjectByKeys(
    globalPackageJson.devDependencies
  );

  writeJsonFile(globalPackageJsonPath, globalPackageJson);
  writeJsonFile(packageJsonPath, packageJsonOriginal);

  await runCommands(
    {
      command: getPackageManagerCommand().install,
      parallel: false,
      color: true,
      __unparsed__: [],
    },
    context
  );

  return {
    success: true,
  };
}
