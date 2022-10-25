import { Linter } from '@nrwl/linter';
import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';
import type { Styles } from '@nrwl/angular/src/generators/utils/types';

export interface Schema {
  name: string;
  inlineStyle?: boolean;
  inlineTemplate?: boolean;
  viewEncapsulation?: 'Emulated' | 'Native' | 'None';
  routing?: boolean;
  prefix?: string;
  style?: Styles;
  skipTests?: boolean;
  directory?: string;
  tags?: string;
  linter?: Linter;
  unitTestRunner?: UnitTestRunner;
  backendProject?: string;
  strict?: boolean;
  standaloneConfig?: boolean;
  mfe?: boolean;
  mfeType?: 'host' | 'remote';
  remotes?: string[];
  port?: number;
  host?: string;
  setParserOptionsProject?: boolean;
}
