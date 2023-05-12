/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ProjectGraph,
  ProjectGraphProcessorContext,
  ProjectGraphBuilder,
  DependencyType,
  ProjectFileMap,
} from '@nx/devkit';

import { TypeScriptVueImportLocator } from './TypeScriptVueImportLocator';
import { TargetProjectLocator } from 'nx/src/plugins/js/project-graph/build-dependencies/target-project-locator';

export type ExplicitDependency = {
  sourceProjectName: string;
  targetProjectName: string;
  sourceProjectFile: string;
  type?: DependencyType.static | DependencyType.dynamic;
};

export async function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
) {
  const builder = new ProjectGraphBuilder(graph);
  const filesToProcess = context.filesToProcess;
  if (Object.keys(filesToProcess).length == 0) {
    return graph;
  }

  const explicitDependencies: ExplicitDependency[] =
    buildExplicitTypeScriptDependencies(graph, filesToProcess);
  explicitDependencies.forEach((dependency: ExplicitDependency) => {
    builder.addStaticDependency(
      dependency.sourceProjectName,
      dependency.targetProjectName,
      dependency.sourceProjectFile
    );
  });

  return builder.getUpdatedProjectGraph();
}

export function buildExplicitTypeScriptDependencies(
  graph: ProjectGraph,
  filesToProcess: ProjectFileMap
) {
  function isRoot(projectName: string) {
    return graph.nodes[projectName]?.data?.root === '.';
  }

  const importLocator = new TypeScriptVueImportLocator();
  const targetProjectLocator = new TargetProjectLocator(
    graph.nodes,
    graph?.externalNodes || {}
  );

  const res: ExplicitDependency[] = [];
  Object.keys(filesToProcess).forEach((source) => {
    Object.values(filesToProcess[source]).forEach((f) => {
      importLocator.fromFile(f.file, (importExpr: any) => {
        const target = targetProjectLocator.findProjectWithImport(
          importExpr,
          f.file
        );
        let targetProjectName;
        if (target) {
          if (!isRoot(source) && isRoot(target)) {
            // TODO: These edges technically should be allowed but we need to figure out how to separate config files out from root
            return;
          }

          targetProjectName = target;
        } else {
          // treat all unknowns as npm packages, they can be eiher
          // - mistyped local import, which has to be fixed manually
          // - node internals, which should still be tracked as a dependency
          // - npm packages, which are not yet installed but should be tracked
          targetProjectName = `npm:${importExpr}`;
        }

        res.push({
          sourceProjectName: source,
          targetProjectName,
          sourceProjectFile: f.file,
        });
      });
    });
  });

  return res;
}
