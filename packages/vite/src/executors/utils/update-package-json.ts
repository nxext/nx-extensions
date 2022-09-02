import {
  ExecutorContext,
  normalizePath,
  ProjectGraphProjectNode,
  readJsonFile,
  writeJsonFile,
} from '@nrwl/devkit';
import {
  DependentBuildableProjectNode,
  updateBuildableProjectPackageJsonDependencies,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';
import { join } from 'path';
import { fileExists } from 'nx/src/utils/fileutils';

interface NormalizedExecutorOptions {
  updateBuildableProjectDepsInPackageJson?: boolean;
  buildableProjectDepsInPackageJsonType: 'dependencies' | 'peerDependencies';
  outputPath: string;
  project: string;
}

export function updatePackageJson(
  options: NormalizedExecutorOptions,
  context: ExecutorContext,
  target: ProjectGraphProjectNode<any>,
  dependencies: DependentBuildableProjectNode[],
  withTypings = true
): void {
  const pathToPackageJson = join(context.root, options.project, 'package.json');

  const packageJson = fileExists(pathToPackageJson)
    ? readJsonFile(pathToPackageJson)
    : { name: context.projectName };

  writeJsonFile(`${options.outputPath}/package.json`, packageJson);

  if (
    dependencies.length > 0 &&
    options.updateBuildableProjectDepsInPackageJson
  ) {
    updateBuildableProjectPackageJsonDependencies(
      context.root,
      context.projectName,
      context.targetName,
      context.configurationName,
      target,
      dependencies,
      options.buildableProjectDepsInPackageJsonType
    );
  }
}
