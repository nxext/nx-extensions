import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { updatePackagesInPackageJson } from '@nrwl/workspace';
import * as path from 'path';

function displayInformation() {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info(stripIndents`
      Capacitor configs will now be generated within the associated frontend project
      instead of a dedicated Capacitor project. View the 'MIGRATION.md' for this plugin
      for details on migrating.

      https://github.com/nxtend-team/nxtend/blob/main/packages/capacitor/MIGRATION.md
    `);
  };
}

export default function update(): Rule {
  return chain([
    displayInformation(),
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '2.0.0'
    ),
  ]);
}
