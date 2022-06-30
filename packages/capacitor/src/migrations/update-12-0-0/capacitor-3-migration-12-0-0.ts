import {
  formatFiles,
  getProjects,
  logger,
  stripIndents,
  Tree,
  updateProjectConfiguration,
} from '@nxext/devkit';

export default async function update(host: Tree) {
  logger.info(stripIndents`
    Capacitor 3 has been released and it is recommended that you upgrade your application if you have not already.
    You will need to upgrade before using the new run command.

    https://capacitorjs.com/docs/updating/3-0
    `);

  const projects = getProjects(host);
  for (const [projectName, project] of projects) {
    const isCapacitorProject = !!Object.values(project.targets || {}).find(
      (target) => target.executor === '@nxtend/capacitor:cap'
    );

    if (isCapacitorProject) {
      project.targets = {
        ...project.targets,
        run: {
          executor: '@nxtend/capacitor:cap',
          options: {
            cmd: 'add',
            packageInstall: true,
          },
          configurations: {
            ios: {
              cmd: 'add ios',
            },
            android: {
              cmd: 'add android',
            },
          },
        },
      };
    }

    updateProjectConfiguration(host, projectName, project);
  }

  await formatFiles(host);
}
