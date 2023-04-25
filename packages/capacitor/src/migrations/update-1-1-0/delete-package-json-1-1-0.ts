import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { readJsonInTree, readWorkspace } from '@nx/workspace';

function displayInformation(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const config = readJsonInTree(host, 'package.json');
    if (config.devDependencies && config.devDependencies['@nrwl/jest']) {
      context.logger.info(stripIndents`
      With @nxtend/capacitor 1.1.0 a package.json is no longer necessary
      for each Capacitor project. Going forward, the workspace package.json
      will be temporarily copied to the project directory and then deleted
      once the Capacitor command has been deleted.

      All package.json files within Capacitor projects will be deleted with
      this migration.
    `);
    }
  };
}

function deleteCapacitorPackageJsons(): Rule {
  return (host: Tree) => {
    const workspaceJson = readWorkspace(host);
    const capacitorProjectRoots = Object.keys(workspaceJson.projects)
      .filter(
        (projectKey) =>
          workspaceJson.projects[projectKey].architect.add?.builder ===
          '@nxtend/capacitor:add'
      )
      .map((projectKey) => workspaceJson.projects[projectKey].root);

    capacitorProjectRoots.forEach((projectRoot: string) =>
      host.delete(`${projectRoot}/package.json`)
    );
  };
}

export default function update(): Rule {
  return chain([displayInformation(), deleteCapacitorPackageJsons]);
}
