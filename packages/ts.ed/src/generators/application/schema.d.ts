export interface TsEdApplicationSchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  host?: string;
  port?: number;
}

export interface NormalizedSchema extends TsEdApplicationSchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
