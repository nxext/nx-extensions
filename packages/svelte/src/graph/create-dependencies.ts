import {
  CreateDependencies,
  CreateDependenciesContext,
  DependencyType,
  ProjectGraphProjectNode,
  RawProjectGraphDependency,
  validateDependency,
} from '@nx/devkit';
// `TargetProjectLocator` has no replacement in the `createDependencies` (V2) public API yet.
// `@nx/js` re-exports the same class from its `/internal` subpath instead of a raw `nx/src/*`
// deep-import, which is the supported indirection for internal-but-still-needed Nx symbols
// (see e.g. `nx/src/plugins/js/project-graph/build-dependencies/build-dependencies.ts`, which
// builds up the exact same `nodes` shape from a `CreateDependenciesContext` before constructing
// this locator).
import { TargetProjectLocator } from '@nx/js/internal';

import { TypeScriptSvelteImportLocator } from './TypeScriptSvelteImportLocator';

function isRoot(
  projects: CreateDependenciesContext['projects'],
  projectName: string
): boolean {
  return projects[projectName]?.root === '.';
}

export const createDependencies: CreateDependencies = (
  _options,
  context: CreateDependenciesContext
): RawProjectGraphDependency[] => {
  const filesToProcess = context.filesToProcess.projectFileMap;
  if (Object.keys(filesToProcess).length === 0) {
    return [];
  }

  // `TargetProjectLocator`'s constructor still expects `Record<string, ProjectGraphProjectNode>`.
  // `type` is never read by the locator (only `data`, for root/tsconfig lookups), so any value
  // from the allowed union is fine here.
  const nodes: Record<string, ProjectGraphProjectNode> = {};
  for (const projectName of Object.keys(context.projects)) {
    nodes[projectName] = {
      name: projectName,
      type: 'lib',
      data: context.projects[projectName],
    };
  }
  const targetProjectLocator = new TargetProjectLocator(
    nodes,
    context.externalNodes
  );

  const importLocator = new TypeScriptSvelteImportLocator();
  const dependencies: RawProjectGraphDependency[] = [];

  for (const [source, fileDataList] of Object.entries(filesToProcess)) {
    for (const fileData of fileDataList) {
      importLocator.fromFile(fileData.file, (importExpr, filePath, type) => {
        if (type !== DependencyType.static && type !== DependencyType.dynamic) {
          return;
        }

        const target = targetProjectLocator.findProjectFromImport(
          importExpr,
          filePath
        );
        if (!target) {
          return;
        }

        // TODO: These edges technically should be allowed but we need to figure out how to separate config files out from root
        if (
          !isRoot(context.projects, source) &&
          isRoot(context.projects, target)
        ) {
          return;
        }

        const dependency: RawProjectGraphDependency = {
          source,
          target,
          sourceFile: filePath,
          type,
        };

        validateDependency(dependency, context);
        dependencies.push(dependency);
      });
    }
  }

  return dependencies;
};
