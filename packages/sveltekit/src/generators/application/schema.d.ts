import { LinterType } from '@nx/eslint';

export interface SveltekitGeneratorSchema {
  name: string;
  unitTestRunner: 'none' | 'vitest';
  tags?: string;
  directory?: string;
  port?: number;
  skipFormat: boolean;
  linter: LinterType;
  skipPackageJson?: boolean;
  adapterVersion?: string;
  svelteVersion?: string;
  svelteKitVersion?: string;
  rootProject?: boolean;
}

export interface NormalizedSchema extends SveltekitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  distDir: string;
  parsedTags: string[];
}
