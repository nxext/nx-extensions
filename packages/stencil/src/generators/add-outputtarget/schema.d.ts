export type OutputTargetType = 'angular' | 'react' | 'vue';

export interface AddOutputtargetSchematicSchema {
  projectName: string;
  outputType: OutputTargetType;
  publishable: boolean;
  importPath?: string;
  unitTestRunner: 'jest' | 'none';
  skipFormat: boolean;
}
