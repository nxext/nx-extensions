import { Linter } from '@nx/linter';

export interface SveltekitGeneratorSchema {
  name: string;
  unitTestRunner: 'none' | 'vitest';
  tags?: string;
  directory?: string;
  port?: number;
  skipFormat: boolean;
  linter: Linter;
}

export interface NormalizedSchema extends SveltekitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  distDir: string;
  parsedTags: string[];
}
