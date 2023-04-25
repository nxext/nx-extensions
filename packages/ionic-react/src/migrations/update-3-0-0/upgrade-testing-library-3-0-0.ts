import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { readJsonInTree, updatePackagesInPackageJson } from '@nx/workspace';
import * as path from 'path';

function displayInformation(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const config = readJsonInTree(host, 'package.json');
    if (config.devDependencies && config.devDependencies['@nrwl/jest']) {
      context.logger.info(stripIndents`
      @testing-library/user-event is being upgraded two major versions. 

      View the release notes for information on breaking changes:

      11.0.0: https://github.com/testing-library/user-event/releases/tag/v11.0.0
      12.0.0: https://github.com/testing-library/user-event/releases/tag/v12.0.0
    `);
    }
  };
}

export default function update(): Rule {
  return chain([
    displayInformation(),
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '3.0.0'
    ),
  ]);
}
