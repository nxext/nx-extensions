import { Tree, updateJson } from '@nrwl/devkit';
import { isStencilProject } from '../utils/migration-utils';

export default function update(host: Tree) {
  updateJson(host, 'workspace.json', (workspaceJson) => {
    Object.keys(workspaceJson.projects).map((k) => {
      const project = workspaceJson.projects[k];

      if (isStencilProject(project)) {
        Object.keys(project.targets).map((key) => {
          if (!project.targets[key].outputs) {
            project.targets[key].outputs = ['{options.outputPath}'];
          }
        });
      }
    });

    return workspaceJson;
  });
}
