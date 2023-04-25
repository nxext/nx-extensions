import { Linter } from '@nx/linter';

export interface Schema {
  name: string;
  skipFormat: boolean;
  directory?: string;
  tags?: string;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  linter: Linter;
  pascalCaseFiles?: boolean;
  skipWorkspaceJson?: boolean;
  setParserOptionsProject?: boolean;
  standaloneConfig?: boolean;
  supportJSX: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  fileName: string;
}
