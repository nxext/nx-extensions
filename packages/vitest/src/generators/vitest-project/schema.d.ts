export type FrameworkType = 'generic' | 'svelte';

export interface VitestProjectGeneratorSchema {
  project: string;
  framework: FrameworkType;
}
