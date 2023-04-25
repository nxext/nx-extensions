import { chain, Rule } from '@angular-devkit/schematics';
import { updatePackagesInPackageJson } from '@nx/workspace';
import * as path from 'path';

export default function update(): Rule {
  return chain([
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '1.1.0'
    ),
  ]);
}
