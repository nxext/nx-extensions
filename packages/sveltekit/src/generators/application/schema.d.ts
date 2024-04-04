import { Linter } from '@nx/eslint';

export interface SveltekitGeneratorSchema {
  name: string;
  unitTestRunner: 'none' | 'vitest';
  tags?: string;
  directory?: string;
  port?: number;
  skipFormat: boolean;
  linter: Linter;
  skipPackageJson?: boolean;
  adapterVersion?: string;
  svelteVersion?: string;
  svelteKitVersion?: string;
}

export interface NormalizedSchema extends SveltekitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  distDir: string;
  parsedTags: string[];
}
