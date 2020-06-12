import { chain, Rule } from '@angular-devkit/schematics';
import { updateWorkspaceInTree } from '@nrwl/workspace';
import { isStencilProjectBuilder } from '../utils/migration-utils';

export default function update(): Rule {
  return chain([updateWorkspaceAddSchematicsOptions]);
}

function updateWorkspaceAddSchematicsOptions(): Rule {
  return (tree, context) => {
    return updateWorkspaceInTree((workspaceJson) => {
      Object.keys(workspaceJson.projects).map((k) => {
        const project = workspaceJson.projects[k];

        if (isStencilProjectBuilder(project, 'build') && !project.schematics) {
          project.schematics = {
            '@nxext/stencil:component': {
              style: 'css',
              storybook: false,
            },
          };
        }
      });

      return workspaceJson;
    });
  };
}
