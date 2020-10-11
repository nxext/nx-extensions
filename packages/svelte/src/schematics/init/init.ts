import { chain, noop, Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { addDepsToPackageJson, addPackageWithInit } from '@nrwl/workspace';

export default function (schema: Schema): Rule {
  return chain([
    schema.unitTestRunner === 'jest'
      ? addPackageWithInit('@nrwl/jest')
      : noop(),
    schema.e2eTestRunner === 'cypress'
      ? addPackageWithInit('@nrwl/cypress')
      : noop(),
    addDepsToPackageJson(
      {},
      {
        'svelte-jester': '^1.1.5',
        svelte: '^3.29.0',
        'svelte-preprocess': '^4.4.2',
      }
    ),
  ]);
}
