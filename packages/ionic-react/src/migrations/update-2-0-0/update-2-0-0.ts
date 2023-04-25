import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { readJsonInTree, updatePackagesInPackageJson } from '@nx/workspace';
import * as path from 'path';

function displayInformation(host: Tree, context: SchematicContext) {
  const config = readJsonInTree(host, 'package.json');
  if (config.devDependencies && config.devDependencies['@nx/cypress']) {
    context.logger.info(stripIndents`
      @testing-library/cypress is being updated to 6.0.0 and includes breaking changes.
      
      https://github.com/testing-library/cypress-testing-library/releases/tag/v6.0.0

      ---------------------------------------------------------------------------------------

      @testing-library/user-event is being updated to 10.0.1 and includes breaking changes.

      https://github.com/testing-library/user-event/releases/tag/v9.0.0
      https://github.com/testing-library/user-event/releases/tag/v10.0.0
    `);
  }
}

export default function update(): Rule {
  return chain([
    displayInformation,
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '2.0.0'
    ),
  ]);
}
