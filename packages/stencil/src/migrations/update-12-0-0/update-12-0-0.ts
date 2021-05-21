import { joinPathFragments, Tree, updateJson } from '@nrwl/devkit';
import { isStencilProject } from '../utils/migration-utils';
import { updatePackagesInPackageJson } from '@nrwl/workspace';

export default function update(host: Tree) {
  updatePackagesInPackageJson(
    joinPathFragments(__dirname, '../../../', 'migrations.json'),
    '12.0.0'
  );

  updateJson(host, 'workspace.json', workspaceJson => {
    Object.keys(workspaceJson.projects).map((k) => {
      const project = workspaceJson.projects[k];

      if (isStencilProject(project)) {
        delete project.generators['@nxext/stencil:component'].storybook
      }
    });

    return workspaceJson;
  })
}
