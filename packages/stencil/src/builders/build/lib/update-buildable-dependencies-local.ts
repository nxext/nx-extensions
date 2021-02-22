import {
  ProjectGraphNode,
  readJsonFile,
  readNxJson,
  readWorkspaceJson,
} from '@nrwl/workspace';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { BuilderContext } from '@angular-devkit/architect';
import { DependentBuildableProjectNode } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { getOutputsForTargetAndConfiguration } from '@nrwl/workspace/src/tasks-runner/utils';
import { logger } from '@nrwl/devkit';
import { writeJsonFile } from '@nrwl/workspace/src/utilities/fileutils';

export function updateBuildableProjectPackageJsonDependenciesWithLocalPath(
  context: BuilderContext,
  node: ProjectGraphNode,
  dependencies: DependentBuildableProjectNode[]
) {
  const outputs = getOutputsForTargetAndConfiguration(
    {
      overrides: {},
      target: context.target,
    },
    node
  );
  const packageJsonPath = `${appRootPath}/${outputs[0]}/package.json`;
  const packageJson = readJsonFile(packageJsonPath);
  const { projects } = readWorkspaceJson();
  const npmScope = readNxJson().npmScope;

  dependencies = dependencies.filter(
    (dependency) =>
      projects[dependency.node.name].projectType === 'library' &&
      projects[dependency.node.name].targets?.build?.executor ===
        '@nxext/stencil:build'
  );

  dependencies.forEach((dependency) => {
    logger.info(
      projects[dependency.node.name].targets?.build.options.outputPath
    );
  });
  dependencies.forEach((dependency) => {
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    packageJson.dependencies[
      `@${npmScope}/${dependency.node.name}`
    ] = `${appRootPath}/${
      projects[dependency.node.name].targets?.build.options.outputPath
    }/dist`;
  });
  writeJsonFile(packageJsonPath, packageJson);
}

export function getProjectDistPath(name: string) {
  return `${appRootPath}/dist/packages/${name}`;
}

function hasDependency(
  outputJson,
  depConfigName: string,
  packageName: string
): boolean {
  if (outputJson[depConfigName]) {
    return outputJson[depConfigName][packageName];
  } else {
    return false;
  }
}
