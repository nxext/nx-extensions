import { chain, Rule, Tree } from '@angular-devkit/schematics';
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
              style: calculateStyleLibrary(tree),
              storybook: false,
            },
          };
        }
      });

      return workspaceJson;
    });
  };
}

function calculateStyleLibrary(tree: Tree) {
  let styleEnding = null;
  ['css', 'scss', 'less', 'styl', 'pcss'].forEach((style) =>
    tree.visit((filePath) => {
      if (filePath.endsWith(style)) {
        styleEnding = style;
      }
    })
  );

  return styleEnding || 'css';
}
