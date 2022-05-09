import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { readJsonInTree, updatePackagesInPackageJson } from '@nrwl/workspace';
import * as path from 'path';

function displayInformation(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const config = readJsonInTree(host, 'package.json');
    if (config.devDependencies && config.devDependencies['@nrwl/jest']) {
      context.logger.info(stripIndents`
      @capacitor/electron is no longer supported and will not be updated 
      with this plugin.

      If you are interested in Electron support then look into the community
      plugin: https://github.com/capacitor-community/electron
    `);
    }
  };
}

export default function update(): Rule {
  return chain([
    displayInformation(),
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '1.1.0'
    ),
  ]);
}
