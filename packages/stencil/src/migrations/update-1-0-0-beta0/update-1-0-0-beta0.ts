import { chain, Rule } from '@angular-devkit/schematics';
import { updateWorkspace } from '@nrwl/workspace';

export default function update(): Rule {
  return chain([changeServeBuilderToBuild]);
}

const changeServeBuilderToBuild = updateWorkspace((workspace) => {
  workspace.projects.forEach((project) => {
    project.targets.forEach((target) => {
      if (target.builder === '@nxext/stencil:serve') {
        target.builder = '@nxext/stencil:build';
        target.options.watch = true;
        target.options.serve = true;
      }
    });
  });
});
