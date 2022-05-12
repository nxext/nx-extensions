/* eslint-disable @typescript-eslint/no-explicit-any */
import { chain, Rule } from '@angular-devkit/schematics';
import { updateWorkspaceInTree } from '@nrwl/workspace';

function updateWebpackConfig() {
  return updateWorkspaceInTree((json) => {
    Object.values<any>(json.projects).forEach((project) => {
      if (
        project.architect?.build?.options?.webpackConfig !==
        '@nxext/ionic-react/plugins/webpack'
      ) {
        return;
      }

      project.architect.build.options.webpackConfig =
        '@nrwl/react/plugins/webpack';
    });

    return json;
  });
}

export default function update(): Rule {
  return chain([updateWebpackConfig()]);
}
