import { chain, noop, Rule } from '@angular-devkit/schematics';
import { formatFiles } from '@nrwl/workspace';
import { prepareVueLibrary } from './lib/vue';
import { prepareReactLibrary } from './lib/react';
import { prepareAngularLibrary } from './lib/angular';
import { addToOutputTargetToConfig, OutputTargetType } from './lib/add-outputtarget-to-config';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: OutputTargetType;
  publishable: boolean;
}

export default function (options: AddOutputtargetSchematicSchema): Rule {
  return chain([
    options.outputType === 'react' ? prepareReactLibrary(options) : noop(),
    options.outputType === 'angular' ? prepareAngularLibrary(options) : noop(),
    options.outputType === 'vue' ? prepareVueLibrary(options) : noop(),
    addToOutputTargetToConfig(options.projectName, options.outputType),
    formatFiles()
  ]);
}
