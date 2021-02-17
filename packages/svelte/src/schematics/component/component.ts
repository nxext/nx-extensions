import { chain, Rule } from '@angular-devkit/schematics';
import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createComponentInProject } from './lib/create-component-in-project';

export interface SvelteComponentSchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}

export default function (options: SvelteComponentSchema): Rule {
  return chain([
    createComponentInProject(options),
    addExportsToBarrel(options)
  ]);
}
