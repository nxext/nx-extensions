export interface SvelteLibrarySchema {
  name: string;
  tags?: string;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  directory?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends SvelteLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
}
