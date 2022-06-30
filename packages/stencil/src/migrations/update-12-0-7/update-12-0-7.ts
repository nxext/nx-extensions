import {
  getProjects,
  joinPathFragments,
  Tree,
  updateProjectConfiguration,
} from '@nxext/devkit';
import { isStencilProject } from '../utils/migration-utils';
import { updatePackagesInPackageJson } from '@nrwl/workspace';

export default function update(host: Tree) {
  updatePackagesInPackageJson(
    joinPathFragments(__dirname, '../../../', 'migrations.json'),
    '12.0.0'
  );

  const projects = getProjects(host);

  projects.forEach((project, name) => {
    if (isStencilProject(project)) {
      ['e2e', 'serve', 'test', 'build'].forEach((target) => {
        if (
          project.targets[target] &&
          project.targets[target].options.outputPath === undefined
        ) {
          project.targets[target].options.outputPath = `dist/${project.root}`;
        }
      });
      updateProjectConfiguration(host, name, project);
    }
  });
}
