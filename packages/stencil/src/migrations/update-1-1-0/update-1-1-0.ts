import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { readJsonInTree, updatePackagesInPackageJson } from '@nrwl/workspace';
import * as path from 'path';

function showInformation(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const config = readJsonInTree(host, 'package.json');
    if (config.devDependencies && config.devDependencies['@nrwl/jest']) {
      context.logger.info(stripIndents`
      ****
      **** Stencil is updated to version 1.16.3. The stencil compiler had some breaking changes. This version is not backwards compatibe!
      ****
    `);
    }
  };
}

export default function update(): Rule {
  return chain([
    showInformation,
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '1.1.0'
    ),
  ]);
}
