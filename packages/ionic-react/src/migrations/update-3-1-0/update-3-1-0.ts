import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  formatFiles,
  readJsonInTree,
  updatePackagesInPackageJson,
} from '@nrwl/workspace';
import * as path from 'path';

function displayInformation(host: Tree, context: SchematicContext) {
  const config = readJsonInTree(host, 'package.json');
  if (config.devDependencies && config.devDependencies['@nrwl/cypress']) {
    context.logger.info(stripIndents`
      @testing-library/cypress is being updated to 7.0.0 and includes breaking changes.
      
      https://github.com/testing-library/cypress-testing-library/releases/tag/v7.0.0
    `);
  }
}

export default function update(): Rule {
  return chain([
    displayInformation,
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '3.1.0'
    ),
    formatFiles(),
  ]);
}
