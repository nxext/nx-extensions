export type FrameworkType = 'generic' | 'svelte' | 'react';

export interface VitestProjectGeneratorSchema {
  project: string;
  framework: FrameworkType;
}
