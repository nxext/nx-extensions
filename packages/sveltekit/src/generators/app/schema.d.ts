import { Linter } from '@nrwl/linter';

export interface SveltekitGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
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
