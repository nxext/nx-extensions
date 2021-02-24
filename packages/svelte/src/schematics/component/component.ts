import { chain, Rule } from '@angular-devkit/schematics';
import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createComponentInProject } from './lib/create-component-in-project';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

export interface SvelteComponentSchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}

export function componentSchematic(options: SvelteComponentSchema): Rule {
  return chain([
    createComponentInProject(options),
    addExportsToBarrel(options)
  ]);
}

export default componentSchematic;
export const componentGenerator = wrapAngularDevkitSchematic(
  '@nxext/svelte',
  'component'
);
