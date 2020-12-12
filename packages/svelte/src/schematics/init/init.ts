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
    addPackageWithInit('@nrwl/web'),
    addDepsToPackageJson(
      {},
      {
        'svelte-jester': '^1.3.0',
        '@rollup/plugin-commonjs': '^16.0.0',
        '@rollup/plugin-node-resolve': '^10.0.0',
        'rollup-plugin-css-only': '^3.0.0',
        'rollup-plugin-livereload': '^2.0.0',
        'rollup-plugin-svelte': '^7.0.0',
        'rollup-plugin-terser': '^7.0.2',
        'svelte': '^3.31.0',
        'svelte-check': '^1.1.20',
        'svelte-preprocess': '^4.6.1',
        '@rollup/plugin-typescript': '^6.0.0',
        '@tsconfig/svelte': '^1.0.0'
      }
    ),
  ]);
}
