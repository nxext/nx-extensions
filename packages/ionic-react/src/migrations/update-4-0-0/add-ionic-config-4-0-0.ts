/* eslint-disable @typescript-eslint/no-explicit-any */
import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';

function getIonicReactProjectPaths(
  host: Tree
): { name: string; path: string }[] {
  let ionicReactProjectPaths: string[] = [];
  const ionicReactProjectPathMap: { name: string; path: string }[] = [];
  const workspaceJson = readJsonInTree(host, 'workspace.json');
  Object.values<any>(workspaceJson.projects).forEach((project) => {
    Object.values<any>(project.architect).forEach((target) => {
      if (
        target.options?.webpackConfig !== '@nxext/ionic-react/plugins/webpack'
      ) {
        return;
      }

      ionicReactProjectPaths = [...ionicReactProjectPaths, project.root];
    });
  });

  Object.values<any>(workspaceJson.projects).forEach((project) => {
    for (const path of ionicReactProjectPaths) {
      if (path === project.root) {
        const projectRoots = Object.values(workspaceJson.projects).map(
          (project: ProjectDefinition) => project.root
        );
        const name = Object.keys(workspaceJson.projects)[
          projectRoots.indexOf(project.root)
        ];
        ionicReactProjectPathMap.push({ name, path });
      }
    }
  });

  return ionicReactProjectPathMap;
}

function addIonicConfigToProjects() {
  return (host: Tree) => {
    const ionicReactProjectPathMap = getIonicReactProjectPaths(host);

    ionicReactProjectPathMap.forEach((ionicReactProjectPath) => {
      if (host.exists(`${ionicReactProjectPath.path}/ionic.config.json`)) {
        return;
      }

      host.create(
        `${ionicReactProjectPath.path}/ionic.config.json`,
        JSON.stringify({
          name: ionicReactProjectPath.name,
          integrations: {
            capacitor: {},
          },
          type: 'react',
        })
      );
    });
  };
}

export default function update(): Rule {
  return chain([addIonicConfigToProjects()]);
}
