import { normalizePath, Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';
import { viteConfigurationGenerator } from '@nrwl/vite';

export async function createViteConfiguration(
  host: Tree,
  options: NormalizedSchema
) {
  const includeVitest = options.unitTestRunner === 'vitest';
  const viteTask = await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.projectName,
    newProject: true,
    includeVitest: includeVitest,
    inSourceTests: options.inSourceTests,
  });
  host.delete(normalizePath(`${options.appProjectRoot}/vite.config.ts`));
  return viteTask;
}
