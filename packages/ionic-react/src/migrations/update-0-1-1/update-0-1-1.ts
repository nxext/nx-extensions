import { chain, Rule } from '@angular-devkit/schematics';
import { addDepsToPackageJson } from '@nrwl/workspace';

export default function update(): Rule {
  return chain([addDepsToPackageJson({}, { '@nrwl/react': '9.0.0' })]);
}
