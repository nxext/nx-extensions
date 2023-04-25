import { chain, Rule } from '@angular-devkit/schematics';
// TODO: update to using devkit.
// import { addDependenciesToPackageJson } from '@nx/devkit';
import { updatePackagesInPackageJson } from '@nx/workspace';
import * as path from 'path';

export default function update(): Rule {
  return chain([
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '11.0.0'
    ),
  ]);
}
