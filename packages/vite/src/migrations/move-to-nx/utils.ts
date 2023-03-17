import {
  getProjects,
  ProjectConfiguration,
  readJson,
  Tree,
} from '@nrwl/devkit';

type CallBack<T> = (
  currentValue: T,
  project: string,
  target: string,
  configuration?: string
) => void;

/**
 * Calls a function for each different options that an executor is configured with
 */
export function forEachExecutorOptions<Options>(
  tree: Tree,
  /**
   * Name of the executor to update options for
   */
  executorName: string,
  /**
   * Callback that is called for each options configured for a builder
   */
  callback: CallBack<Options>
): void {
  forEachProjectConfig(getProjects(tree), executorName, callback);
}

function forEachProjectConfig<Options>(
  projects: Map<string, ProjectConfiguration>,
  executorName: string,
  callback: CallBack<Options>
): void {
  for (const [projectName, project] of projects) {
    for (const [targetName, target] of Object.entries(project.targets || {})) {
      if (executorName !== target.executor) {
        continue;
      }

      if (target.options) {
        callback(target.options, projectName, targetName);
      }

      if (!target.configurations) {
        continue;
      }
      Object.entries(target.configurations).forEach(([configName, options]) => {
        callback(options, projectName, targetName, configName);
      });
    }
  }
}

export function readNxVersion(tree: Tree): string {
  const packageJson = readJson(tree, 'package.json');

  const nxVersion = packageJson.devDependencies['@nrwl/workspace']
    ? packageJson.devDependencies['@nrwl/workspace']
    : packageJson.dependencies['@nrwl/workspace'];

  if (!nxVersion) {
    throw new Error('@nrwl/workspace is not a dependency.');
  }

  return nxVersion;
}
