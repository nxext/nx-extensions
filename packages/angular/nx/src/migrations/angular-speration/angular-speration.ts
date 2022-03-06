/* eslint-disable @typescript-eslint/no-unused-vars */
import { getProjects, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { join } from 'path';

export default function update(host: Tree) {
  const projects = getProjects(host);

  for (const [projectName, project] of projects) {
    let hasChanged = false;
    for (const [key, config] of Object.entries(project.targets)) {
      if (
        config.options?.frameworkConfigFile === '@nxext/angular/plugins/vite'
      ) {
        hasChanged = true;
        config.options = {
          ...config.options,
          frameworkConfigFile: '@nxext/angular-vite/src/lib/vite',
        };
      }
      return;
    }

    if (hasChanged) {
      updateProjectConfiguration(host, projectName, project);
    }
  }
}
