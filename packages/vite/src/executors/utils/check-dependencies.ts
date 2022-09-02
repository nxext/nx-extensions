import {
  ExecutorContext,
  ProjectGraphProjectNode,
  readCachedProjectGraph,
} from '@nrwl/devkit';
import {
  calculateProjectDependencies,
  DependentBuildableProjectNode,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';

export function checkDependencies(context: ExecutorContext): {
  projectRoot: string;
  target: ProjectGraphProjectNode<any>;
  dependencies: DependentBuildableProjectNode[];
} {
  const projectGraph = readCachedProjectGraph();
  const { target, dependencies, nonBuildableDependencies } =
    calculateProjectDependencies(
      projectGraph,
      context.root,
      context.projectName,
      context.targetName,
      context.configurationName
    );
  const projectRoot = target.data.root;

  if (nonBuildableDependencies.length > 0) {
    throw new Error(
      `Buildable libraries can only depend on other buildable libraries. You must define the ${
        context.targetName
      } target for the following libraries: ${nonBuildableDependencies
        .map((t) => `"${t}"`)
        .join(', ')}`
    );
  }

  return {
    projectRoot,
    target,
    dependencies,
  };
}
