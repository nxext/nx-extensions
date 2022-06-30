/**
 * The Nx Devkit is the underlying technology used to customize Nx to support
 * different technologies and custom use-cases. It contains many utility
 * functions for reading and writing files, updating configuration,
 * working with Abstract Syntax Trees(ASTs), and more.
 *
 * As with most things in Nx, the core of Nx Devkit is very simple.
 * It only uses language primitives and immutable objects
 * (the tree being the only exception).
 */

/**
 * @category Tree
 */
export type { Tree, FileChange } from '@nrwl/devkit';

export { toJS } from '@nrwl/devkit';

/**
 * @category Workspace
 */
export type {
  ProjectsConfigurations,
  TargetDependencyConfig,
  TargetConfiguration,
  ProjectConfiguration,
  ProjectType,
  Workspace,
} from '@nrwl/devkit';

/**
 * @category Workspace
 */
export type {
  Generator,
  GeneratorCallback,
  Executor,
  ExecutorContext,
  TaskGraphExecutor,
  GeneratorsJson,
  ExecutorsJson,
  MigrationsJson,
  CustomHasher,
  HasherContext,
} from '@nrwl/devkit';

/**
 * @category Workspace
 */
export { Workspaces } from '@nrwl/devkit';

export {
  readNxJson,
  readAllWorkspaceConfiguration,
  workspaceLayout,
} from '@nrwl/devkit';

export type { NxPlugin, ProjectTargetConfigurator } from '@nrwl/devkit';

/**
 * @category Workspace
 */
export type { Task, TaskGraph } from '@nrwl/devkit';

/**
 * @category Workspace
 */
export type {
  ImplicitDependencyEntry,
  ImplicitJsonSubsetDependency,
  NxJsonConfiguration,
  NxAffectedConfig,
} from '@nrwl/devkit';

/**
 * @category Logger
 */
export { logger } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { output } from '@nrwl/devkit';

/**
 * @category Package Manager
 */
export type { PackageManager } from '@nrwl/devkit';

/**
 * @category Package Manager
 */
export {
  getPackageManagerCommand,
  detectPackageManager,
  getPackageManagerVersion,
} from '@nrwl/devkit';

/**
 * @category Commands
 */
export type { Target } from '@nrwl/devkit';
/**
 * @category Commands
 */
export { runExecutor } from '@nrwl/devkit';

/**
 * @category Generators
 */
export { formatFiles } from '@nrwl/devkit';

/**
 * @category Generators
 */
export { generateFiles } from '@nrwl/devkit';

/**
 * @category Generators
 */
export type { WorkspaceConfiguration } from '@nrwl/devkit';

/**
 * @category Generators
 */
export {
  addProjectConfiguration,
  readProjectConfiguration,
  removeProjectConfiguration,
  updateProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  getProjects,
  isStandaloneProject,
} from '@nrwl/devkit';

/**
 * @category Generators
 */
export { visitNotIgnoredFiles } from '@nrwl/devkit';

/**
 * @category Executors
 */
export {
  parseTargetString,
  targetToTargetString,
} from './src/executors/parse-target-string';

/**
 * @category Executors
 */
export { readTargetOptions } from './src/executors/read-target-options';

/**
 * @category Project Graph
 */
export type {
  ProjectFileMap,
  FileData,
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphNode,
  ProjectGraphProjectNode,
  ProjectGraphExternalNode,
  ProjectGraphProcessorContext,
} from '@nrwl/devkit';

/**
 * @category Project Graph
 */
export { DependencyType } from '@nrwl/devkit';

/**
 * @category Project Graph
 */
export { ProjectGraphBuilder } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { readJson, writeJson, updateJson } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { parseJson, serializeJson, stripJsonComments } from '@nrwl/devkit';

/**
 * @category Utils
 */
export type { JsonParseOptions, JsonSerializeOptions } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { readJsonFile, writeJsonFile } from '@nrwl/devkit';

/**
 * @category Utils
 */
export {
  addDependenciesToPackageJson,
  removeDependenciesFromPackageJson,
} from './src/utils/package-json';

/**
 * @category Utils
 */
export { installPackagesTask } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { names } from './src/utils/names';

/**
 * @category Utils
 */
export {
  getWorkspaceLayout,
  getWorkspacePath,
} from './src/utils/get-workspace-layout';

/**
 * @category Utils
 */
export type {
  StringChange,
  StringDeletion,
  StringInsertion,
} from './src/utils/string-change';

/**
 * @category Utils
 */
export { applyChangesToString, ChangeType } from './src/utils/string-change';

/**
 * @category Utils
 */
export { offsetFromRoot } from './src/utils/offset-from-root';

/**
 * @category Utils
 */
export { convertNxGenerator } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { convertNxExecutor } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { stripIndents } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { joinPathFragments, normalizePath } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { moveFilesToNewDirectory } from './src/utils/move-dir';

/**
 * @category Utils
 */
export { workspaceRoot } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { createProjectGraphAsync, readCachedProjectGraph } from '@nrwl/devkit';

/**
 * @category Utils
 */
export { getOutputsForTargetAndConfiguration } from '@nrwl/devkit';
