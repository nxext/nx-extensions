import { OutputTargetType } from './lib/add-outputtarget-to-config';

export type OutputTargetType = 'angular' | 'react' | 'vue' | 'svelte';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: OutputTargetType;
  publishable: boolean;
  unitTestRunner: 'jest' | 'none',
  skipFormat: boolean;
}
