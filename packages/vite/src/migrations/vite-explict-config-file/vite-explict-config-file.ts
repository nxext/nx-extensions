/* eslint-disable @typescript-eslint/no-unused-vars */
import { getProjects, Tree, updateProjectConfiguration } from '@nxext/devkit';
import { join } from 'path';

export default function update(host: Tree) {
  const projects = getProjects(host);

  for (const [projectName, project] of projects) {
    const viteConfigPath = join(project.root, 'vite.config.js');
    const hasViteConfig = host.exists(viteConfigPath);

    if (!hasViteConfig) {
      return;
    }

    let hasChanged = false;
    for (const [key, config] of Object.entries(project.targets)) {
      if (
        (config.executor === '@nxext/vite:build' ||
          config.executor === '@nxext/vite:dev') &&
        !config.options?.configFile &&
        hasViteConfig
      ) {
        hasChanged = true;
        config.options = { ...config.options, configFile: viteConfigPath };
      }
      return;
    }

    if (hasChanged) {
      updateProjectConfiguration(host, projectName, project);
    }
  }
}
