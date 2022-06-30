import {
  getProjects,
  joinPathFragments,
  Tree,
  updateProjectConfiguration,
} from '@nxext/devkit';
import { isStencilProject } from '../utils/migration-utils';
import { ProjectType, updatePackagesInPackageJson } from '@nrwl/workspace';
import { getLintTarget } from '../../utils/targets';

export default function update(host: Tree) {
  updatePackagesInPackageJson(
    joinPathFragments(__dirname, '../../../', 'migrations.json'),
    '13.1.0'
  );

  const projects = getProjects(host);

  projects.forEach((project, name) => {
    if (isStencilProject(project)) {
      project.targets.lint = getLintTarget(
        ProjectType[project.projectType],
        project.root
      );
      updateProjectConfiguration(host, name, project);
    }
  });
}
