import { Linter } from '@nx/linter';

export interface Schema {
  name: string;
  directory?: string;
  skipTsConfig: boolean;
  skipFormat: boolean;
  tags?: string;
  pascalCaseFiles?: boolean;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  linter: Linter;
  publishable?: boolean;
  buildable?: boolean;
  importPath?: string;
  supportJSX?: boolean;
  setParserOptionsProject?: boolean;
  standaloneConfig?: boolean;
}
