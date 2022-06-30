/* eslint-disable @typescript-eslint/no-unused-vars */
import { getProjects, Tree, updateProjectConfiguration } from '@nxext/devkit';
import { join } from 'path';

export default function update(host: Tree) {
  const projects = getProjects(host);

  for (const [projectName, project] of projects) {
    let hasChanged = false;
    for (const [key, config] of Object.entries(project.targets)) {
      if (
        config.executor === '@nxext/vite:package' &&
        !!config.options?.viteConfig
      ) {
        hasChanged = true;
        config.options = {
          ...config.options,
          configFile: config.options?.viteConfig,
        };
        delete config.options.viteConfig;
      }
      return;
    }

    if (hasChanged) {
      updateProjectConfiguration(host, projectName, project);
    }
  }
}
