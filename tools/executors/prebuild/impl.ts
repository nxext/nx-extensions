import {
  BuilderContext,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString
} from '@angular-devkit/architect';
import { concat, from } from 'rxjs';
import { json } from '@angular-devkit/core';
import { ProjectGraph, readJsonFile, readNxJson, readWorkspaceJson } from '@nrwl/workspace';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { switchMap, tap } from 'rxjs/operators';
import { writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';

interface Options extends json.JsonObject {
  projectName: string;
  target: string;
}

export default createBuilder((options: Options, context: BuilderContext) => {
  context.logger.info(`Executing "preparebuild"...`);

  const targetProject = options.projectName;
  const projGraph = createProjectGraph();
  const dependencies = recursivelyCollectDependencies(
    targetProject,
    projGraph,
    []
  );
  const npmScope = readNxJson().npmScope;

  return concat(dependencies.map(dep => {
    context.logger.info(`Building @${npmScope}/${dep}...`);

    return scheduleTargetAndForget(context, targetFromTargetString(`${dep}:${options.target}`));
  })).pipe(
    switchMap(() =>
      from(scheduleTargetAndForget(context, targetFromTargetString(`${targetProject}:${options.target}`)))
        .pipe(
          tap(() => context.logger.info(`Building @${npmScope}/${targetProject}...`)))),
    tap(() => {
      const publishableLibNames = getPublishableLibNames();

      const packageJsonFilePath = `${getProjectDistPath(context, targetProject)}/package.json`;
      const packageJson = readJsonFile(packageJsonFilePath);

      publishableLibNames.forEach(lib => {
        if (hasDependency(packageJson, 'dependencies', `@${npmScope}/${lib}`)) {
          packageJson.dependencies[`@${npmScope}/${lib}`] = getProjectDistPath(context, lib);
        }
      });
      writeJsonFile(packageJsonFilePath, packageJson);
    })
  );
});

export function getPublishableLibNames(workspaceJson = readWorkspaceJson()) {
  const { projects } = workspaceJson;

  return Object.keys(projects).filter(
    (key) =>
      projects[key].projectType === 'library' &&
      projects[key].targets?.build?.executor === '@nrwl/node:package'
  );
}

export function getProjectDistPath(context: BuilderContext, name: string) {
  return `${context.workspaceRoot}/dist/packages/${name}`;
}

function recursivelyCollectDependencies(
  project: string,
  projGraph: ProjectGraph,
  acc: string[]
) {
  (projGraph.dependencies[project] || []).forEach((dependency) => {
    const depNode = projGraph.nodes[dependency.target];

    if (acc.indexOf(dependency.target) === -1 && depNode.type === 'lib') {
      acc.push(dependency.target);
      recursivelyCollectDependencies(dependency.target, projGraph, acc);
    }
  });
  return acc;
}

function hasDependency(outputJson, depConfigName: string, packageName: string): boolean {
  if (outputJson[depConfigName]) {
    return outputJson[depConfigName][packageName];
  } else {
    return false;
  }
}
